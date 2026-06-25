#include <iostream>
#include <cstring>

#include <nlohmann/json.hpp>

#include "PacketParser.h"
#include "F1Structs.h"

std::string PacketParser::parsePacketToJson(const std::vector<uint8_t>& data) {
    // Security check: The packet must contain almost the header
    if(data.size() < sizeof(PacketHeader)) {
        return "";
    }

    // 1. Header extraction
    PacketHeader header;
    std::memcpy(&header, data.data(), sizeof(PacketHeader));

    // 2. Sort based on packet type
    if(header.m_packetId == 0) { // ID 0 = Motion Packet
        // TODO
    }
    else if(header.m_packetId == 1) { //ID 1 = Session Packet
        // TODO
    }
    else if(header.m_packetId == 2) { //ID 2 = Lap Data Packet
        // TODO
    }
    else if(header.m_packetId == 3) { //ID 3 = Event Packet
        // TODO
    }
    else if(header.m_packetId == 4) { //ID 4 = Participants Packet
        // TODO
    }
    else if(header.m_packetId == 5) { //ID 5 = Car Setup Packet
        // TODO
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
        
            // Create JSON object
            nlohmann::json j;
            j["type"] = "telemetry";
            j["speed"] = myCar.m_speed;
            j["throttle"] = myCar.m_throttle;
            j["streer"] = myCar.m_steer;
            j["brake"] = myCar.m_brake;
            j["clutch"] = myCar.m_clutch;
            j["gear"] = myCar.m_gear;
            j["engineRPM"] = myCar.m_engineRPM;
            j["drs"] = myCar.m_drs;
            j["revLightsPercent"] = myCar.m_revLightsPercent;
            j["revLightsBitValue"] = myCar.m_revLightsBitValue;
            j["tyresSurfaceTemperature"] = {myCar.m_tyresSurfaceTemperature[0],
                                            myCar.m_tyresSurfaceTemperature[1],
                                            myCar.m_tyresSurfaceTemperature[2],
                                            myCar.m_tyresSurfaceTemperature[3]
                                            };
            j["tyresInnerTemperature"] = {myCar.m_tyresInnerTemperature[0],
                                          myCar.m_tyresInnerTemperature[1],
                                          myCar.m_tyresInnerTemperature[2],
                                          myCar.m_tyresInnerTemperature[3]
                                         };
            j["tyresPressure"] = {myCar.m_tyresPressure[0],
                                  myCar.m_tyresPressure[1],
                                  myCar.m_tyresPressure[2],
                                  myCar.m_tyresPressure[3]
                                 };
            j["surfaceType"] = {myCar.m_surfaceType[0],
                                myCar.m_surfaceType[1],
                                myCar.m_surfaceType[2],
                                myCar.m_surfaceType[3]
                               };



            std::cout << "\r[TELEMETRY] Gear: " << myCar.m_gear
                      << "| RPM: " << myCar.m_engineRPM 
                      << "| Speed: " << myCar.m_speed << " km/h"
                      << "| Acceleration: " << (myCar.m_throttle * 100) << "%" 
                      << "| Braking: " << (myCar.m_brake * 100) << "% "
                      << m_currentTyre << std::flush;

            return j.dump();
        }
        else {
            std::cerr << "[Car Telemetry Packet] ERROR: packet dimension not comform" << std::endl;
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

            return "";
        }
        else {
            std::cerr << "[Car Status Packet] ERROR: packet dimension not comform" << std::endl;
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

    return "";
}