#include <iostream>
#include <cstring>

#include "PacketParser.h"
#include "F1Structs.h"

void PacketParser::parsePacket(const std::vector<uint8_t>& data) {
    // Security check: The packet must contain almost the header
    if(data.size() < sizeof(PacketHeader)) {
        return;
    }

    // 1. Header extraction
    PacketHeader header;
    std::memcpy(&header, data.data(), sizeof(PacketHeader));

    // 2. Sort based on packet type
    if(header.m_packetId == 0) { // ID 0 = Motion Packet
        // TODO
        std::cout << "[Motion Packet] Not implemented yet" << std::endl;
    }
    else if(header.m_packetId == 1) { //ID 1 = Session Packet
        // TODO
        std::cout << "[Session Packet] Not implemented yet" << std::endl;
    }
    else if(header.m_packetId == 2) { //ID 2 = Lap Data Packet
        // TODO
        std::cout << "[Lap Data Packet] Not implemented yet" << std::endl;
    }
    else if(header.m_packetId == 3) { //ID 3 = Event Packet
        // TODO
        std::cout << "[Event Packet] Not implemented yet" << std::endl;
    }
    else if(header.m_packetId == 4) { //ID 4 = Participants Packet
        // TODO
        std::cout << "[Participants Packet] Not implemented yet" << std::endl;
    }
    else if(header.m_packetId == 5) { //ID 5 = Car Setup Packet
        // TODO
        std::cout << "[Car Setup Packet] Not implemented yet" << std::endl;
    }
    else if(header.m_packetId == 6) { //ID 6 = Car Telemetry Packet
        // Security check on packed dimension to avoid buffer over-read
        if(data.size() == sizeof(PacketCarTelemetryData)) {
            PacketCarTelemetryData telemetry;
            std::memcpy(&telemetry, data.data(), sizeof(PacketCarTelemetryData));

            // The packet contains data of all 22 cars
            // The header indicates which is our car index in these array
            uint8_t playerIndex = header.m_playerCarIndex;
            const auto& myCar = telemetry.m_carTelemetryData[playerIndex];
        
            // Print values
            std::cout << "\r[TELEMETRY] Gear: " << (int)myCar.m_gear
                      << "| RPM: " << myCar.m_engineRPM 
                      << "| Speed: " << myCar.m_speed << " km/h"
                      << "| Acceleration: " << (myCar.m_throttle * 100) << "%" 
                      << "| Braking: " << (myCar.m_brake * 100) << "%" << std::flush;
        }
        else {
            std::cerr << "ERROR: Packet dimension not comform" << std::endl;
        }
    }
    else if(header.m_packetId == 7) { //ID 7 = Car Status Packet
        if(data.size() == sizeof(CarStatusData)) {
            PacketCarStatusData carStatusData;
            std::memcpy(&carStatusData, data.data(), sizeof(PacketCarStatusData));

            uint8_t playerIndex = header.m_playerCarIndex;
            const auto& myCar = carStatusData.m_carStatusData[playerIndex];

            // Print Tyre type
            if(myCar.m_visualTyreCompound == 16) { // Soft tyres
                std::cout << "\r\033[31mS\033[0m" << std::flush;
            }
            if(myCar.m_visualTyreCompound == 17) { // Medium tyres
                std::cout << "\r\033[33mM\033[0m" << std::flush;
            }
            if(myCar.m_visualTyreCompound == 18) { // Hard tyres
                std::cout << "\r\033[0mH\033[0m" << std::flush;
            }
            else {
                std::cout << "N/D" << std::flush;
            }
        }
    }
    else if(header.m_packetId == 8) { //ID 8 = Final Classification Packet
        // TODO
        std::cout << "[Final Classification Packet] Not implemented yet" << std::endl;
    }
    else if(header.m_packetId == 9) { //ID 9 = Lobby Info Packet
        // TODO
        std::cout << "[Lobby Info Packet] Not implemented yet" << std::endl;
    }
    else if(header.m_packetId == 10) { //ID 10 = Car Damage Packet
        // TODO
        std::cout << "[Car Damage Packet] Not implemented yet" << std::endl;
    }
    else if(header.m_packetId == 11) { //ID 11 = Session History Packet
        // TODO
        std::cout << "[Session History Packet] Not implemented yet" << std::endl;
    }
    else if(header.m_packetId == 12) { //ID 12 = Tyre Sets Packet
        // TODO
        std::cout << "[Tyre Sets Packet] Not implemented yet" << std::endl;
    }
    else if(header.m_packetId == 13) { //ID 13 = Motion Ex Packet
        // TODO
        std::cout << "[Motion Ex Packet] Not implemented yet" << std::endl;
    }
    else if(header.m_packetId == 14) { //ID 14 = Time Trial Packet
        // TODO
        std::cout << "[Time Trial Packet] Not implemented yet" << std::endl;
    }
    else if(header.m_packetId == 15) { //ID 15 = Lap Positions Packet
        // TODO
        std::cout << "[Lap Positions Packet] Not implemented yet" << std::endl;
    }
}