<script setup>
import { ref, computed, watch } from "vue";
import {  createCus,  editCus } from "../../api/cus";
import { createLabel, getLabel } from "../../api/label";
import toast from "../../utils/toast";
const props = defineProps([
  "visible",
  "dialogForm",
  "dialogStatus",
  "getAllCusData",
]);
const emit = defineEmits(["update:visible", "update:dialogForm"]);
const visible = computed({
  get() {
    return props.visible;
  },
  set(value) {
    emit("update:visible", value);
  },
});
const dialogForm = computed({
  get() {
    return props.dialogForm;
  },
  set(value) {
    emit("update:dialogForm", value);
  },
});
const dialogStatusWatcher = computed(() => props.dialogStatus);
const levelOptions = ["銅", "銀", "金", "白金"];
const statusOptions = ["新客戶", "舊客戶", "潛在客戶"];
const addLabelText = ref("");
const labelList = ref([]);

watch(dialogStatusWatcher, (dialogStatus) => {
  if (dialogStatus === "edit") {
    initLabelData();
  }
});
const handleAddLabel = async () => {
  await createLabel({ label_name: addLabelText.value });
  await initLabelData();
  toast.add({
    severity: "success",
    summary: "新增成功",
    life: 3000,
  });
  addLabelText.value = "";
};
const initLabelData = async () => {
  const labelData = await getLabel();
  labelList.value = labelData;
};
const dialogFormNotValid = () => {
  const {
    cus_name,
    cus_number,
    cus_email,
    cus_idnumber,
    cus_remark,
    cus_status,
    cus_level,
  } = dialogForm.value;
  if (!isValid(cus_name, /^(?!\s*$).+/)) return "姓名不能為空";
  if (!isValid(cus_number, /^09\d{8}$/)) return "電話號碼有誤";
  if (
    !isValid(
      cus_email,
      /^([A-Za-z0-9\._-]+)@([A-Za-z0-9\._-]+)\.([A-Za-z]{2,})$/
    )
  )
    return "Email格式有誤";
  if (!isValid(cus_idnumber, /^[A-Z][12][0-9]{8}/)) return "身分證字號格式有誤";
  if (!isValid(cus_level, /^(?!\s*$).+/)) return "等級不能為空";
  if (!isValid(cus_status, /^(?!\s*$).+/)) return "狀態不能為空";
  if (!isValid(cus_remark, /^(?!\s*$).+/)) return "備註不能為空";

  return false;
};
function isValid(value, rule) {
  return rule.test(value);
}
const handleSubmit = async () => {
  const notValidMessage = dialogFormNotValid();
  if (notValidMessage) {
    toast.add({
      severity: "error",
      summary: notValidMessage,
      life: 3000,
    });
    return;
  }
  let message;
  if (props.dialogStatus.value === "add") {
    await createCus(dialogForm.value);
    // await createCus({ ...dialogForm.value, user_id: props.userInfo.id });
    message = "新增成功";
  } else {
    const editData = {
      // user_id: props.userInfo.id,
      ...dialogForm.value,
    };
    await editCus(editData);
    message = "修改成功";
  }
  toast.add({
    severity: "success",
    summary: message,
    life: 3000,
  });
  props.getAllCusData();

  visible.value = false;
};
</script>

<template>
  <Dialog
    v-model:visible="visible"
    modal
    :header="dialogStatus === 'add' ? '新增客戶' : '修改客戶'"
    :style="{ width: '50vw' }"
    :breakpoints="{ '960px': '75vw', '641px': '100vw' }"
  >
    <div class="p-fluid">
      <div>
        <label>姓名</label>
        <InputText v-model="dialogForm.cus_name" type="text" />
      </div>
      <div>
        <label>電話</label>
        <InputText v-model="dialogForm.cus_number" type="text" />
      </div>
      <div>
        <label>E-mail</label>
        <InputText v-model="dialogForm.cus_email" type="text" />
      </div>
      <div>
        <label>身分證字號</label>
        <InputText v-model="dialogForm.cus_idnumber" type="text" />
      </div>
      <div>
        <label for="">等級</label>
        <Dropdown :options="levelOptions" v-model="dialogForm.cus_level" />
      </div>
      <div>
        <label for="">狀態</label>
        <Dropdown :options="statusOptions" v-model="dialogForm.cus_status" />
      </div>
      <div>
        <label>備註</label>
        <Textarea rows="2" v-model="dialogForm.cus_remark" />
      </div>
      <template v-if="dialogStatus === 'edit'">
        <div>
          <label>新增標籤</label>
          <InputText v-model="addLabelText" type="text" />
          <Button
            style="margin-top: 2px"
            label="新增標籤"
            @click="handleAddLabel"
          />
        </div>
        <div>
          <label>標籤</label>
          <MultiSelect
            v-model="dialogForm.label_names"
            :options="labelList"
            optionLabel="label_name"
            placeholder="選擇標籤"
            :filter="true"
            style="min-height: 40px"
          >
            <template #value="slotProps">
              <div v-for="option of slotProps.value" :key="option.id">
                <div>{{ option.label_name }}</div>
              </div>
              <template v-if="!slotProps.value || slotProps.value.length === 0">
                <div>選擇標籤</div>
              </template>
            </template>
          </MultiSelect>
        </div>
      </template>
    </div>
    <template #footer>
      <Button label="取消" icon="pi pi-times" @click="visible = false" text />
      <Button label="確認" icon="pi pi-check" @click="handleSubmit" autofocus />
    </template>
  </Dialog>
</template>

<style lang="scss" scoped></style>
