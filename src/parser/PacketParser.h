#pragma once

#include <vector>
#include <cstdint>

class PacketParser {
    public:
        // It receives raw bytes from UDP listener and decodes them
        void parsePacket(const std::vector<uint8_t>& data);
};