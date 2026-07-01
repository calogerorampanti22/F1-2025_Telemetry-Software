#pragma once

#include <cstdint>
#include <iostream>
#include <array>
#include <nlohmann/json.hpp>

#include "../parser/F1Structs.h"

class CarTelemetry {
    private:
        uint16_t m_speed;
        float m_throttle;
        float m_steer;
        float m_brake;
        uint8_t m_clutch;
        int8_t m_gear;
        uint16_t m_engineRPM;
        uint8_t m_drs;
        uint8_t m_revLightsPercent;
        uint16_t m_revLightsBitValue;
        uint16_t m_brakesTemperature[4];
        uint8_t m_tyresSurfaceTemperature[4];
        uint8_t m_tyresInnerTemperature[4];
        uint16_t m_engineTemperature;
        float m_tyresPressure[4];
        uint8_t m_surfaceType[4];
        
    public:
        CarTelemetry(CarTelemetryData carTelemetryData)
            : m_speed(carTelemetryData.m_speed),
            m_throttle(carTelemetryData.m_throttle),
            m_steer(carTelemetryData.m_steer),
            m_brake(carTelemetryData.m_brake),
            m_clutch(carTelemetryData.m_clutch),
            m_gear(carTelemetryData.m_gear),
            m_engineRPM(carTelemetryData.m_engineRPM),
            m_drs(carTelemetryData.m_drs),
            m_revLightsPercent(carTelemetryData.m_revLightsPercent),
            m_revLightsBitValue(carTelemetryData.m_revLightsBitValue),
            m_engineTemperature(carTelemetryData.m_engineTemperature)
        {
            for (int i = 0; i < 4; i++) {
                m_brakesTemperature[i] = carTelemetryData.m_brakesTemperature[i];
                m_tyresSurfaceTemperature[i] = carTelemetryData.m_tyresSurfaceTemperature[i];
                m_tyresInnerTemperature[i] = carTelemetryData.m_tyresInnerTemperature[i];
                m_tyresPressure[i] = carTelemetryData.m_tyresPressure[i];
                m_surfaceType[i] = carTelemetryData.m_surfaceType[i];
            }
        }

        std::string toJson() {
            nlohmann::json jsonObject;
            
            jsonObject["type"] = "telemetry";
            jsonObject["speed"] = m_speed;
            jsonObject["throttle"] = m_throttle;
            jsonObject["steer"] = m_steer;
            jsonObject["brake"] = m_brake;
            jsonObject["clutch"] = m_clutch;
            jsonObject["gear"] = m_gear;
            jsonObject["engineRPM"] = m_engineRPM;
            jsonObject["drs"] = m_drs;
            jsonObject["revLightsPercent"] = m_revLightsPercent;
            jsonObject["revLightsBitValue"] = m_revLightsBitValue;
            jsonObject["brakesTemperature"] = {
                                                        m_brakesTemperature[0],
                                                        m_brakesTemperature[1],
                                                        m_brakesTemperature[2],
                                                        m_brakesTemperature[3],
                                                        };
            jsonObject["tyresSurfaceTemperature"] = { 
                                                               m_tyresSurfaceTemperature[0],
                                                               m_tyresSurfaceTemperature[1],
                                                               m_tyresSurfaceTemperature[2],
                                                               m_tyresSurfaceTemperature[3]
                                                            };
            jsonObject["tyresInnerTemperature"] = { 
                                                             m_tyresInnerTemperature[0],
                                                             m_tyresInnerTemperature[1],
                                                             m_tyresInnerTemperature[2],
                                                             m_tyresInnerTemperature[3]
                                                           };

            jsonObject["engineTemperature"] = m_engineTemperature;                                            
            
            jsonObject["tyresPressure"] = { 
                                                     m_tyresPressure[0],
                                                     m_tyresPressure[1],
                                                     m_tyresPressure[2],
                                                     m_tyresPressure[3]
                                                   };
            jsonObject["surfaceType"] = { 
                                                   m_surfaceType[0],
                                                   m_surfaceType[1],
                                                   m_surfaceType[2],
                                                   m_surfaceType[3]
                                                 };
                            
            return jsonObject.dump();
        }
};