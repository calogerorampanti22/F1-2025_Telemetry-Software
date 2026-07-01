#include <iostream>
#include <cstring>

#include <nlohmann/json.hpp>

#include "PacketParser.h"
#include "F1Structs.h"
#include "../models/Lap.hpp"
#include "../models/Session.hpp"
#include "../models/CarTelemetry.hpp"
#include "../models/CarStatus.hpp"
#include "../models/Participant.hpp"

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
        if(data.size() == sizeof(PacketSessionData)) {
            PacketSessionData sessionData;
            std::memcpy(&sessionData, data.data(), sizeof(PacketSessionData));

            Session mySession = sessionData;

            return mySession.toJson();
        }
        else {
            std::cerr << "[Session Packet] ERROR: packet dimension not comform" << std::endl;
        }
    }
    else if(header.m_packetId == 2) { //ID 2 = Lap Data Packet
        // Security check on packed dimension to avoid buffer over-read
        if(data.size() == sizeof(PacketLapData)) {
            PacketLapData lapData;
            std::memcpy(&lapData, data.data(), sizeof(PacketLapData));

            nlohmann::json laps;
            laps["type"] = "lapData";
            laps["playerCarIndex"] = header.m_playerCarIndex;
            laps["cars"] = nlohmann::json::array();

            for(int i = 0; i < 22; i++) {
                Lap currentLap(lapData.m_lapData[i], i);

                laps["cars"].push_back(nlohmann::json::parse(currentLap.toJson()));
            }

            return laps.dump();

        }
        else {
            std::cerr << "[Car Telemetry Packet] ERROR: packet dimension not comform" << std::endl;
        }
    }
    else if(header.m_packetId == 3) { //ID 3 = Event Packet
        // TODO
    }
    else if(header.m_packetId == 4) { //ID 4 = Participants Packet
        if(data.size() == sizeof(PacketParticipantsData)) {
            PacketParticipantsData participantsData;
            std::memcpy(&participantsData, data.data(), sizeof(PacketParticipantsData));

            nlohmann::json participants;
            participants["type"] = "participants";
            participants["drivers"] = nlohmann::json::array();
            for(int i = 0; i < 22; i++) {
                Participant participant(participantsData.m_participants[i]);
                participants["drivers"].push_back(nlohmann::json::parse(participant.toJson()));
            }

            return participants.dump();
        }
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
            CarTelemetry myCarTelemetry = telemetry.m_carTelemetryData[playerIndex];
            
            return myCarTelemetry.toJson();          
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
            CarStatus myCarStatus = status.m_carStatusData[playerIndex];

            return myCarStatus.toJson();

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