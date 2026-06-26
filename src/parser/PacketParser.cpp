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
            nlohmann::json telemetryJSONObject;
            telemetryJSONObject["type"] = "telemetry";
            telemetryJSONObject["speed"] = myCar.m_speed;
            telemetryJSONObject["throttle"] = myCar.m_throttle;
            telemetryJSONObject["steer"] = myCar.m_steer;
            telemetryJSONObject["brake"] = myCar.m_brake;
            telemetryJSONObject["clutch"] = myCar.m_clutch;
            telemetryJSONObject["gear"] = myCar.m_gear;
            telemetryJSONObject["engineRPM"] = myCar.m_engineRPM;
            telemetryJSONObject["drs"] = myCar.m_drs;
            telemetryJSONObject["revLightsPercent"] = myCar.m_revLightsPercent;
            telemetryJSONObject["revLightsBitValue"] = myCar.m_revLightsBitValue;
            telemetryJSONObject["tyresSurfaceTemperature"] = { 
                                                               myCar.m_tyresSurfaceTemperature[0],
                                                               myCar.m_tyresSurfaceTemperature[1],
                                                               myCar.m_tyresSurfaceTemperature[2],
                                                               myCar.m_tyresSurfaceTemperature[3]
                                                             };
            telemetryJSONObject["tyresInnerTemperature"] = { 
                                                             myCar.m_tyresInnerTemperature[0],
                                                             myCar.m_tyresInnerTemperature[1],
                                                             myCar.m_tyresInnerTemperature[2],
                                                             myCar.m_tyresInnerTemperature[3]
                                                           };
            telemetryJSONObject["tyresPressure"] = { 
                                                     myCar.m_tyresPressure[0],
                                                     myCar.m_tyresPressure[1],
                                                     myCar.m_tyresPressure[2],
                                                     myCar.m_tyresPressure[3]
                                                   };
            telemetryJSONObject["surfaceType"] = { 
                                                   myCar.m_surfaceType[0],
                                                   myCar.m_surfaceType[1],
                                                   myCar.m_surfaceType[2],
                                                   myCar.m_surfaceType[3]
                                                 };

            return telemetryJSONObject.dump();
        }
        else {
            std::cerr << "[Car Telemetry Packet] ERROR: packet dimension not comform" << std::endl;
        }
    }

    else if(header.m_packetId == 7) { //ID 7 = Car Status Packet
        if(data.size() == sizeof(PacketCarStatusData)) {
            PacketCarStatusData status;
            std::memcpy(&status, data.data(), sizeof(PacketCarStatusData));

            // The packet contains data of all 22 cars
            // The header indicates which is our car index in these array
            uint8_t playerIndex = header.m_playerCarIndex;
            const auto& myCar = status.m_carStatusData[playerIndex];

            // Create JSON Object
            nlohmann::json statusJSONObject;
            statusJSONObject["tractionControl"] = myCar.m_tractionControl;
            statusJSONObject["antiLockBrakes"] = myCar.m_antiLockBrakes;
            statusJSONObject["fuelMix"] = myCar.m_fuelMix;
            statusJSONObject["frontBrakeBias"] = myCar.m_frontBrakeBias;
            statusJSONObject["pitLimiterStatus"] = myCar.m_pitLimiterStatus;
            statusJSONObject["fuelInTank"] = myCar.m_fuelInTank;
            statusJSONObject["fuelCapacity"] = myCar.m_fuelCapacity;
            statusJSONObject["fuelRemainingLaps"] = myCar.m_fuelRemainingLaps;
            statusJSONObject["maxRPM"] = myCar.m_maxRPM;
            statusJSONObject["idleRPM"] = myCar.m_idleRPM;
            statusJSONObject["maxGears"] = myCar.m_maxGears;
            statusJSONObject["drsAllowed"] = myCar.m_drsAllowed;
            statusJSONObject["drsActivationDistance"] = myCar.m_drsActivationDistance;
            statusJSONObject["actualTyreCompound"] = myCar.m_actualTyreCompound;
            statusJSONObject["visualTyreCompound"] = myCar.m_visualTyreCompound;
            statusJSONObject["tyresAgeLaps"] = myCar.m_tyresAgeLaps;
            statusJSONObject["vehicleFiaFlags"] = myCar.m_vehicleFiaFlags;
            statusJSONObject["enginePowerICE"] = myCar.m_enginePowerICE;
            statusJSONObject["enginePowerMGUK"] = myCar.m_enginePowerMGUK;
            statusJSONObject["ersStoreEnergy"] = myCar.m_ersStoreEnergy;
            statusJSONObject["ersDeployMode"] = myCar.m_ersDeployMode;
            statusJSONObject["ersHarvestedThisLapMGUK"] = myCar.m_ersHarvestedThisLapMGUK;
            statusJSONObject["ersHarvestedThisLapMGUH"] = myCar.m_ersHarvestedThisLapMGUH;
            statusJSONObject["ersDeployedThisLap"] = myCar.m_ersDeployedThisLap;
            statusJSONObject["networkPaused"] = myCar.m_networkPaused;

            return statusJSONObject.dump();
        }
        else {
            std::cerr << "[Car Status Packet] ERROR: packet dimension not comform" << std::endl;
        }

    }
    else if(header.m_packetId == 8) { //ID 8 = Final Classification Packet
        // TODO
    }
    else if(header.m_packetId == 9) { //ID 9 = Lobby Info Packet
        // TODO
    }
    else if(header.m_packetId == 10) { //ID 10 = Car Damage Packet
        // TODO
    }
    else if(header.m_packetId == 11) { //ID 11 = Session History Packet
        // TODO
    }
    else if(header.m_packetId == 12) { //ID 12 = Tyre Sets Packet
        // TODO
    }
    else if(header.m_packetId == 13) { //ID 13 = Motion Ex Packet
        // TODO
    }
    else if(header.m_packetId == 14) { //ID 14 = Time Trial Packet
        // TODO
    }
    else if(header.m_packetId == 15) { //ID 15 = Lap Positions Packet
        // TODO
    }

    return "";
}