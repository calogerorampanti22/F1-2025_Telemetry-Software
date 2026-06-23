#include <iostream>

#include "network/UDPListener.h"

int main() {
    UDPListener listener(20777);

    listener.start([](const std::vector<uint8_t>&data) {
        std::cout << data.size() << "bytes received" << std::endl;
    
    });

    std::cout << "Press ENTER to exit..." << std::endl;
    std::cin.get();

    listener.stop();
    return 0;
}