#pragma once

#include <cstdint>
#include <iostream>
#include <nlohmann/json.hpp>

#include "parser/F1Structs.h"

class Car {
    public:
        Car() = default;

        Car(const LapData& lapData) :
            m_lastLapTimeInMS(lapData.m_lastLapTimeInMS),
            m_currentLapTimeInMS(lapData.m_currentLapTimeInMS),
            m_sector1TimeMSPart(lapData.m_sector1TimeMSPart),
            m_sector1TimeMinutesPart(lapData.m_sector1TimeMinutesPart),
            m_sector2TimeMSPart(lapData.m_sector2TimeMSPart),
            m_sector2TimeMinutesPart(lapData.m_sector2TimeMinutesPart),
            m_deltaToCarInFrontMSPart(lapData.m_deltaToCarInFrontMSPart),
            m_deltaToCarInFrontMinutesPart(lapData.m_deltaToCarInFrontMinutesPart),
            m_deltaToRaceLeaderMSPart(lapData.m_deltaToRaceLeaderMSPart),
            m_deltaToRaceLeaderMinutesPart(lapData.m_deltaToRaceLeaderMinutesPart),
            m_lapDistance(lapData.m_lapDistance),
            m_totalDistance(lapData.m_totalDistance),
            m_safetyCarDelta(lapData.m_safetyCarDelta),
            m_carPosition(lapData.m_carPosition),
            m_currentLapNum(lapData.m_currentLapNum),
            m_pitStatus(lapData.m_pitStatus),
            m_numPitStops(lapData.m_numPitStops),
            m_sector(lapData.m_sector),
            m_currentLapInvalid(lapData.m_currentLapInvalid),
            m_penalties(lapData.m_penalties),
            m_totalWarnings(lapData.m_totalWarnings),
            m_cornerCuttingWarnings(lapData.m_cornerCuttingWarnings),
            m_numUnservedDriveThroughPens(lapData.m_numUnservedDriveThroughPens),
            m_numUnservedStopGoPens(lapData.m_numUnservedStopGoPens),
            m_gridPosition(lapData.m_gridPosition),
            m_driverStatus(lapData.m_driverStatus),
            m_resultStatus(lapData.m_resultStatus),
            m_pitLaneTimerActive(lapData.m_pitLaneTimerActive),
            m_pitLaneTimeInLaneInMS(lapData.m_pitLaneTimeInLaneInMS),
            m_pitStopTimerInMS(lapData.m_pitStopTimerInMS),
            m_pitStopShouldServePen(lapData.m_pitStopShouldServePen),
            m_speedTrapFastestSpeed(lapData.m_speedTrapFastestSpeed),
            m_speedTrapFastestLap(lapData.m_speedTrapFastestLap) 
        {}

        std::string toJson() {
            nlohmann::json jsonObject;
            jsonObject["type"] = "lapData";
            jsonObject["lastLapTimeInMS"] = m_lastLapTimeInMS;
            jsonObject["currentLapTimeInMS"] = m_currentLapTimeInMS;
            jsonObject["sector1TimeMSPart"] = m_sector1TimeMSPart;
            jsonObject["sector1TimeMinutesPart"] = m_sector1TimeMinutesPart;
            jsonObject["sector2TimeMSPart"] = m_sector2TimeMSPart;
            jsonObject["sector2TimeMinutesPart"] = m_sector2TimeMinutesPart;
            jsonObject["deltaToCarInFrontMSPart"] = m_deltaToCarInFrontMSPart;
            jsonObject["deltaToCarInFrontMinutesPart"] = m_deltaToCarInFrontMinutesPart;
            jsonObject["deltaToRaceLeaderMSPart"] = m_deltaToRaceLeaderMSPart;
            jsonObject["deltaToRaceLeaderMinutesPart"] = m_deltaToRaceLeaderMinutesPart;
            jsonObject["lapDistance"] = m_lapDistance;
            jsonObject["totalDistance"] = m_totalDistance;
            jsonObject["safetyCarDelta"] = m_safetyCarDelta;
            jsonObject["carPosition"] = m_carPosition;
            jsonObject["currentLapNum"] = m_currentLapNum;
            jsonObject["pitStatus"] = m_pitStatus;
            jsonObject["numPitStops"] = m_numPitStops;
            jsonObject["sector"] = m_sector;
            jsonObject["currentLapInvalid"] = m_currentLapInvalid;
            jsonObject["penalties"] = m_penalties;
            jsonObject["totalWarnings"] = m_totalWarnings;
            jsonObject["cornerCuttingWarnings"] = m_cornerCuttingWarnings;
            jsonObject["numUnservedDriveThroughPens"] = m_numUnservedDriveThroughPens;
            jsonObject["numUnservedStopGoPens"] = m_numUnservedStopGoPens;
            jsonObject["gridPosition"] = m_gridPosition;
            jsonObject["driverStatus"] = m_driverStatus;
            jsonObject["resultStatus"] = m_resultStatus;
            jsonObject["pitLaneTimerActive"] = m_pitLaneTimerActive;
            jsonObject["pitLaneTimeInLaneInMS"] = m_pitLaneTimeInLaneInMS;
            jsonObject["pitStopTimerInMS"] = m_pitStopTimerInMS;
            jsonObject["pitStopShouldServePen"] = m_pitStopShouldServePen;
            jsonObject["speedTrapFastestSpeed"] = m_speedTrapFastestSpeed;
            jsonObject["speedTrapFastestLap"] = m_speedTrapFastestLap;

            return jsonObject.dump();
        }

    private:
        uint32_t m_lastLapTimeInMS;
        uint32_t m_currentLapTimeInMS;
        uint16_t m_sector1TimeMSPart;
        uint8_t m_sector1TimeMinutesPart;
        uint16_t m_sector2TimeMSPart;
        uint8_t m_sector2TimeMinutesPart;
        uint16_t m_deltaToCarInFrontMSPart;
        uint8_t m_deltaToCarInFrontMinutesPart;
        uint16_t m_deltaToRaceLeaderMSPart;
        uint8_t m_deltaToRaceLeaderMinutesPart;
        float m_lapDistance;
        float m_totalDistance;
        float m_safetyCarDelta;
        uint8_t m_carPosition;
        uint8_t m_currentLapNum;
        uint8_t m_pitStatus;
        uint8_t m_numPitStops;
        uint8_t m_sector;
        uint8_t m_currentLapInvalid;
        uint8_t m_penalties;
        uint8_t m_totalWarnings;
        uint8_t m_cornerCuttingWarnings;
        uint8_t m_numUnservedDriveThroughPens;
        uint8_t m_numUnservedStopGoPens;
        uint8_t m_gridPosition;
        uint8_t m_driverStatus;
        uint8_t m_resultStatus;
        uint8_t m_pitLaneTimerActive;
        uint16_t m_pitLaneTimeInLaneInMS;
        uint16_t m_pitStopTimerInMS;
        uint8_t m_pitStopShouldServePen;
        float m_speedTrapFastestSpeed;
        uint8_t m_speedTrapFastestLap;
};