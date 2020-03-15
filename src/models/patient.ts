export enum EStatus {
  PENDING = 'PENDING',
  DONE = 'DONE'
}

export type Arrythmia = 'AFib' | 'AV Block' | 'Pause' | 'PSVC' | 'PVC';

export interface Patient {
  id: number;
  name: string;
  status: EStatus;
  createdDate: Date;
  arrythmias: Arrythmia[];
}

/* eslint-disable */
export function getPatientFromJson(data: any): Patient {
  return {
    arrythmias: data['arrhythmias'],
    createdDate: data['created_date'],
    id: data['id'],
    name: data['patient_name'],
    status: data['status'],
  };
}
/* eslint-enable */
