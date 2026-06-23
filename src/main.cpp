#include <iostream>
#include <vector>

#include "network/UDPListener.h"
#include "parser/PacketParser.h"

int main() {
    std::cout << "=== F1 25 Telemetry Client ===" << std::endl;

    UDPListener listener(20777);
    PacketParser parser;

    listener.start([&parser](const std::vector<uint8_t>&data) {
        parser.parsePacket(data);
    });

    std::cout << "Waiting for data on port 20777..." << std::endl;
    std::cout << "Press ENTER for quit.\n" << std::endl;

    std::cin.get();

    std::cout << "Chiusura del socket e terminazione del thread in corso..." << std::endl;
    listener.stop();
    std::cout << "Programma terminato correttamente." << std::endl;
    
    return 0;
}