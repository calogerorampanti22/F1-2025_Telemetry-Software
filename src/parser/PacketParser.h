#pragma once

#include <vector>
#include <cstdint>
#include <string>

class PacketParser {
    public:
        // It receives raw bytes from UDP listener and decodes them
        std::string parsePacketToJson(const std::vector<uint8_t>& data);
    
    private:
        // Last tyres known
        std::string m_currentTyre = "N/D";

        // Helper function to get tyre name and tyre color
        std::string getTyreName(uint8_t visualCompound);

};