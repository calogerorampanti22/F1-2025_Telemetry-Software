#pragma once

#include <cstdint>
#include <functional>
#include <thread>
#include <atomic>
#include <vector>

class UDPListener {
    public:
        // Constructor
        explicit UDPListener(uint16_t port);
        
        // Destructor
        ~UDPListener();

        // Start listen thread
        void start(std::function<void(const std::vector<uint8_t>&)> onPacketRecived);

        // Stop the thread and close the socket
        void stop();

    private:
        void receiveLoop();

        uint16_t m_port;
        std::atomic<bool> m_running;
        std::thread m_listenThread;
        std::function<void(const std::vector<uint8_t>&)> m_callback;

        // Cross-platform managing of socket handling
        #ifdef _WIN32
            uintptr_t m_socket;
        #else
            int m_socket;
        #endif
};