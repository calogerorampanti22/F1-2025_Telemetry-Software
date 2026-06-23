#include <iostream>
#include <cstring>

#include "PacketParser.h"
#include "F1Structs.h"

// Function which convert tyre ID in colored text
std::string PacketParser::getTyreName(uint8_t visualCompound) {
    switch(visualCompound) {
        case 16: return "\033[31m(S)\033[0m";   // Soft Tyres (Red)
        case 17: return "\033[33m(M)\033[0m";   // Medium Tyres (Yellow)
        case 18: return "\033[37m(H)\033[0m";   // Hard Tyres (White)
        case 7:  return "\033[32m(I)\033[0m";   // Intermedium Tyres (Green)
        case 8:  return "\033[34m(W)\033[0m";   // Wet Tyres (Blue)
        default: return "N/D";
    }
}

char PacketParser::getGear(int8_t carGear) {
    switch(carGear) {
        case -1: return 'R'; // Reverse Gear
        case 0: return 'N';  // Neutral Gear
        case 1: return '1';  // 1st Gear
        case 2: return '2';  // 2nd Gear
        case 3: return '3';  // 3rd Gear
        case 4: return '4';  // 4th Gear
        case 5: return '5';  // 5th Gear
        case 6: return '6';  // 6th Gear
        case 7: return '7';  // 7th Gear
        case 8: return '8';  // 8th Gear
        default: return 'E'; // Error
    }
}

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
            std::cout << "\r[TELEMETRY] Gear: " << getGear(myCar.m_gear)
                      << "| RPM: " << myCar.m_engineRPM 
                      << "| Speed: " << myCar.m_speed << " km/h"
                      << "| Acceleration: " << (myCar.m_throttle * 100) << "%" 
                      << "| Braking: " << (myCar.m_brake * 100) << "% "
                      << m_currentTyre << std::flush;
        }
        else {
            std::cerr << "ERROR: Packet dimension not comform" << std::endl;
        }
    }
    else if(header.m_packetId == 7) { //ID 7 = Car Status Packet
        if(data.size() == sizeof(PacketCarStatusData)) {
            PacketCarStatusData status;
            std::memcpy(&status, data.data(), sizeof(PacketCarStatusData));

            uint8_t playerIndex = header.m_playerCarIndex;
            
            //Extracting tyres type and store it in class variable
            uint8_t tyreId = status.m_carStatusData[playerIndex].m_visualTyreCompound;
            m_currentTyre = getTyreName(tyreId);
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