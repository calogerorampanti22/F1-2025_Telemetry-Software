#pragma once

#include <cstdint>
#include <iostream>
#include <nlohmann/json.hpp>

#include "../parser/F1Structs.h"

class Participant {
    private:

        uint8_t m_aiControlled;
        uint8_t m_driverId;
        uint8_t m_networkId;
        uint8_t m_teamId;
        uint8_t m_myTeam;
        uint8_t m_raceNumber;
        uint8_t m_nationality;
        std::string m_name;
        uint8_t m_yourTelemetry;
        uint8_t m_showOnlineNames;
        uint16_t m_techLevel;
        uint8_t m_platform;
        uint8_t m_numColours;
        LiveryColour m_liveryColours[4];

    public:
        Participant(ParticipantData data) :
            m_aiControlled(data.m_aiControlled),
            m_driverId(data.m_driverId),
            m_networkId(data.m_networkId),
            m_teamId(data.m_teamId),
            m_myTeam(data.m_myTeam),
            m_raceNumber(data.m_raceNumber),
            m_nationality(data.m_nationality),
            m_name(data.m_name),
            m_yourTelemetry(data.m_yourTelemetry),
            m_showOnlineNames(data.m_showOnlineNames),
            m_techLevel(data.m_techLevel),
            m_platform(data.m_platform),
            m_numColours(data.m_numColours)
        {
            for(int i = 0; i < 4; i++) {
                m_liveryColours[i] = data.m_liveryColours[i];
            }
        }
        
        std::string toJson() {
            nlohmann::json jsonObject;
            jsonObject["type"] = "participants";
            jsonObject["aiControlled"] = m_aiControlled;
            jsonObject["driverId"] = m_driverId;
            jsonObject["networkId"] = m_networkId;
            jsonObject["teamId"] = m_teamId;
            jsonObject["myTeam"] = m_myTeam;
            jsonObject["raceNumber"] = m_raceNumber;
            jsonObject["nationality"] = m_nationality;
            jsonObject["name"] = m_name;
            jsonObject["yourTelemetry"] = m_yourTelemetry;
            jsonObject["showOnlineNames"] = m_showOnlineNames;
            jsonObject["techLevel"] = m_techLevel;
            jsonObject["platform"] = m_platform;
            jsonObject["numColours"] = m_numColours;
            jsonObject["liveryColour"] = {
                m_liveryColours[0].red, m_liveryColours[0].green, m_liveryColours[0].blue,
                m_liveryColours[1].red, m_liveryColours[1].green, m_liveryColours[1].blue,
                m_liveryColours[2].red, m_liveryColours[2].green, m_liveryColours[2].blue,
                m_liveryColours[3].red, m_liveryColours[3].green, m_liveryColours[3].blue,
            };

            return jsonObject.dump();
        }
};
