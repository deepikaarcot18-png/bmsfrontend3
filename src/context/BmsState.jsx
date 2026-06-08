import { useMemo, useReducer, useEffect, useRef } from 'react';
import { generateInitialState } from '../data/buildingData';
import { useLiveData } from '../hooks/useLiveData';
import { BmsContext } from './BmsContext';

function hasChanged(current, next) {
  return Object.entries(next).some(([key, value]) => current[key] !== value);
}

function applyEntityUpdate(draft, payload) {
  const { type, id, data } = payload;
  const bucket = draft[type];
  if (!bucket || bucket[id] === undefined || !hasChanged(bucket[id], data)) return false;

  draft[type] = {
    ...bucket,
    [id]: { ...bucket[id], ...data },
  };
  return true;
}

function recalculateBuilding(building, floors, clients, equipment) {
  const floorList = Object.values(floors || {});
  const clientList = Object.values(clients || {});
  const equipmentList = Object.values(equipment || {});
  const totalLoadKW = floorList.reduce((sum, floor) => sum + (floor.currentLoad || 0), 0);
  const totalConsumptionKWh = floorList.reduce((sum, floor) => sum + (floor.dailyKWh || 0), 0);
  const activeAlarms = clientList.reduce((sum, client) => sum + (client.alarmCount || 0), 0);
  const runningEquipment = equipmentList.filter((item) => item.running).length;
  const healthScore = floorList.length
    ? Math.round(floorList.reduce((sum, floor) => sum + (floor.health || 0), 0) / floorList.length)
    : building.healthScore;

  return {
    ...building,
    totalLoadKW,
    totalConsumptionKWh,
    activeAlarms,
    runningEquipment,
    healthScore,
    monthlyCostINR: Math.round(totalConsumptionKWh * 8.5),
    epx: clientList.length ? +(totalConsumptionKWh / clientList.length).toFixed(1) : building.epx,
  };
}

function bmsReducer(state, action) {
  switch (action.type) {
    case 'UPDATE_ENTITY': {
      const draft = { ...state };
      const changed = applyEntityUpdate(draft, action.payload);
      return changed ? draft : state;
    }
    case 'BATCH_UPDATE': {
      if (!action.payload?.length) return state;

      const draft = { ...state };
      const changed = action.payload.reduce((didChange, update) => applyEntityUpdate(draft, update) || didChange, false);
      if (!changed) return state;

      if (draft.building && draft.floors && draft.clients && draft.equipment) {
        draft.building = recalculateBuilding(draft.building, draft.floors, draft.clients, draft.equipment);
      }
      return draft;
    }
    case 'SET_INITIAL':
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

export function BmsProvider({ children }) {
  const [state, dispatch] = useReducer(bmsReducer, {});
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    const initial = generateInitialState();
    dispatch({ type: 'SET_INITIAL', payload: initial });
    initialized.current = true;
  }, []);

  useLiveData(dispatch, initialized);

  const value = useMemo(() => ({ state, dispatch }), [state]);

  return <BmsContext.Provider value={value}>{children}</BmsContext.Provider>;
}
