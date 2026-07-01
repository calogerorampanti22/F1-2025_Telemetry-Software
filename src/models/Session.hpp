#pragma once

#include <cstdint>
#include <iostream>
#include <nlohmann/json.hpp>

#include "../parser/F1Structs.h"

class Session {
    private:
        int8_t m_trackId;
        uint16_t m_trackLength;
        
    public:
        Session() = default;

        Session(const PacketSessionData& sessionData) :
            m_trackId(sessionData.m_trackId),
            m_trackLength(sessionData.m_trackLength)
        {}
    
        std::string toJson() {
            nlohmann::json jsonObject;
            jsonObject["type"] = "session";
            jsonObject["trackId"] = m_trackId;
            jsonObject["trackLength"] = m_trackLength;

            return jsonObject.dump();
        }
};