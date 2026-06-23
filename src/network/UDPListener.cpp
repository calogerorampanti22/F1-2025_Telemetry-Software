#include <iostream>
#include <array>

#include "UDPListener.h"

// Header inclusion according to OS
#ifdef _WIN32
    #include <WinSock2.h>
    #include <WS2tcpip.h>
    #pragma comment(lib, "ws2_32.lib") // Required for the linker on MSVC
#else
    #include <sys/socket.h>
    #include <netinet/in.h>
    #include <unistd.h>
#endif

// Constructor implementation
UDPListener::UDPListener(uint16_t port) : m_port(port), m_running(false) {
    #ifdef _WIN32
        m_socket = INVALID_SOCKET;
    #else
        m_socket = -1;
    #endif
}

// Destructor implementation
UDPListener::~UDPListener() {
    stop();
}

// start() function implementation
void UDPListener::start(std::function<void(const std::vector<uint8_t>&)> onPacketRecived) {
    if (m_running)
        return;
    
    m_callback = onPacketRecived;
    m_running = true;

    #ifdef _WIN32
        // Initialization required only for Windows
        WSADATA wsaData;
        if(WSAStartup(MAKEWORD(2, 2), &wsaData) != 0) {
            std::cerr << "ERROR: WinSock initialization failed" << std::endl;
        }

        m_socket = socket(AF_INET, SOCK_DGRAM, IPPROTO_UDP);
        if(m_socket == INVALID_SOCKET) {
            std::cerr << "ERROR: socket creation failed" << std::endl;
            WSACleanup();
            return;
        }

    #else
        m_socket = socket(AF_INET, SOCK_DGRAM, IPPROTO_UDP);
        if(m_socket < 0) {
            std::cerr << "ERROR: socket creation failed" << std::endl;
            return;
        }
    
    #endif

    // Address configuration (listen on all interfaces: 0.0.0.0)
    sockaddr_in serverAddr{};
    serverAddr.sin_family = AF_INET;
    serverAddr.sin_port = htons(m_port);
    serverAddr.sin_addr.s_addr = htonl(INADDR_ANY);

    // Socket binding
    if(bind(m_socket, reinterpret_cast<sockaddr *>(&serverAddr), sizeof(serverAddr)) < 0) {
        std::cerr << "ERROR: Binding failed on port " << m_port << std::endl;
        stop();
        return;
    }

    std::cout << "Listening on UDP port " << m_port << "..." << std::endl;

    m_listenThread = std::thread(&UDPListener::receiveLoop, this);
}

// stop() function implementation
void UDPListener::stop() {
    if(!m_running)
        return;

    m_running = false;

    // Close the socket and force exit from blocking call recvfrom()
    #ifdef _WIN32
        if(m_socket != INVALID_SOCKET) {
            closesocket(m_socket);
            m_socket = INVALID_SOCKET;
        }
        WSACleanup();
    #else
        if(m_socket >= 0) {
            close(m_socket);
            m_socket = -1;
        }
    #endif

    if(m_listenThread.joinable()) {
        m_listenThread.join();
    }
}

// receiveLoop() function implementatation
void UDPListener::receiveLoop() {
    // Pre-allocated buffer on stack to avoid dynamic allocations in the loop
    std::array<uint8_t, 2048> buffer;

    while(m_running) {
        sockaddr_in clientAddr;
        socklen_t clientLen = sizeof(clientAddr);

        //recvfrom() is blocking. It unlocks when a packet arrives or if the socket is closed
        int bytesReceived = recvfrom(m_socket, reinterpret_cast<char *>(buffer.data()), buffer.size(), 0,
                                    reinterpret_cast<sockaddr *>(&clientAddr), &clientLen);

        if(bytesReceived > 0 && m_callback) {
            // Create a vector with exactly dimension of received data, then it send to callback
            std::vector<uint8_t> packetData(buffer.begin(), buffer.begin() + bytesReceived);
            m_callback(packetData);
        } 
        else if(bytesReceived < 0 && m_running) {
            std::cerr << "ERROR: receiving UDP packet" << std::endl;
        }
    }
}
