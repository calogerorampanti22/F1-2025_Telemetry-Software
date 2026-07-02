#pragma once

#include <cstdint>
#include <iostream>
#include <nlohmann/json.hpp>

#include "../parser/F1Structs.h"

class SessionHistory {
    private:
        uint8_t m_carIdx;
        uint32_t m_bestLapTimeInMS;

    public:
        SessionHistory() = default;

        SessionHistory(const PacketSessionHistoryData& data) :
            m_carIdx(data.m_carIdx),
            m_bestLapTimeInMS(0)
        {
            if (data.m_bestLapTimeLapNum > 0 && data.m_bestLapTimeLapNum <= 100) {
                // Laps are 1-indexed, array is 0-indexed
                m_bestLapTimeInMS = data.m_lapHistoryData[data.m_bestLapTimeLapNum - 1].m_lapTimeInMS;
            }
        }
    
        std::string toJson() {
            nlohmann::json jsonObject;
            jsonObject["type"] = "sessionHistory";
            jsonObject["carIdx"] = m_carIdx;
            jsonObject["bestLapTimeInMS"] = m_bestLapTimeInMS;

            return jsonObject.dump();
        }
};
