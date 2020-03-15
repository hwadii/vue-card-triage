<template>
  <div class="cards">
    <div class="pending" @drop="changeStatus" @dragover.prevent>
      <h3>Pending</h3>
      <ul>
        <li
          v-for="patient in pendingPatientsUpdated"
          :key="patient.id"
          class="pending-li"
          :class="{ dragging: isDragging(patient.id)}"
          draggable="true"
          @dragstart="dragStart(patient)"
          @dragend="dragEnd"
        >{{ patient.name }}</li>
      </ul>
    </div>
    <div class="done" @drop="changeStatus($event)" @dragover.prevent>
      <h3>Done</h3>
      <ul>
        <li
          v-for="patient in donePatientsUpdated"
          :key="patient.id"
          class="done-li"
          :class="{ dragging: isDragging(patient.id) }"
          draggable="true"
          @dragstart="dragStart(patient)"
          @dragend="dragEnd"
        >{{ patient.name }}</li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Patient, getPatientFromJson, EStatus } from '../models/patient';

@Component({
  name: 'Cards',
})
export default class Cards extends Vue {
  private patients!: Patient[];
  private donePatients = new Set<Patient>();
  private pendingPatients = new Set<Patient>();
  private draggedPatient: Patient | null = null;

  public isDragging(id: number) {
    return this.patientId === id;
  }

  private get patientId() {
    return this.draggedPatient?.id;
  }

  private get donePatientsUpdated() {
    return this.donePatients;
  }

  private get pendingPatientsUpdated() {
    return this.pendingPatients;
  }

  public async created() {
    const patients = await (await fetch('/cards')).json();
    this.patients = patients.map(getPatientFromJson);
    this.donePatients = new Set(
      this.patients.filter(({ status }) => status === EStatus.DONE),
    );
    this.pendingPatients = new Set(
      this.patients.filter(({ status }) => status === EStatus.PENDING),
    );
  }

  public dragStart(patient: Patient) {
    this.draggedPatient = patient;
  }

  public dragEnd() {
    this.draggedPatient = null;
  }

  public dragOver(event) {
    console.log(event);
  }

  public changeStatus(event) {
    if (this.draggedPatient == null) return;
    const { status } = this.draggedPatient;
    if (status === EStatus.DONE) {
      if (event?.target?.className !== 'pending') return;
      this.draggedPatient.status = EStatus.PENDING;
      this.donePatients.delete(this.draggedPatient);
      this.pendingPatients.add(this.draggedPatient);
    }
    if (status === EStatus.PENDING) {
      if (event.target.className !== 'done') return;
      this.draggedPatient.status = EStatus.DONE;
      this.pendingPatients.delete(this.draggedPatient);
      this.donePatients.add(this.draggedPatient);
    }
  }
}
</script>

<style scoped>
.cards {
  display: flex;
  justify-content: center;
  column-gap: 1rem;
}
.pending {
  border: 0.125rem dashed slateblue;
  width: 50%;
  max-width: 20rem;
}

.done {
  border: 0.125rem dashed coral;
  width: 50%;
  max-width: 20rem;
}

ul {
  list-style-type: none;
  display: inline-block;
  padding: 0;
}

ul > li {
  margin-bottom: 1rem;
  border: 1px solid salmon;
  cursor: pointer;
}

ul > li.dragging {
  display: none;
}
</style>