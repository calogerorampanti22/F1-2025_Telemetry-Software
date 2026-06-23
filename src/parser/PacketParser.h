#pragma once

#include <vector>
#include <cstdint>

class PacketParser {
    public:
        // It receives raw bytes from UDP listener and decodes them
        void parsePacket(const std::vector<uint8_t>& data);
    
    private:
        // Last tyres known
        std::string m_currentTyre = "N/D";

        // Helper function to get tyre name and tyre color
        std::string getTyreName(uint8_t visualCompound);

        //Helper function to get gear
        char getGear(int8_t carGear);
};