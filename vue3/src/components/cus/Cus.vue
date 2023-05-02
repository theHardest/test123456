<script setup>
import { ref, onBeforeMount } from "vue";
import { getAllCus, deleteCus } from "../../api/cus";
import { useConfirm } from "primevue/useconfirm";
import CusDialog from "./CusDialog.vue";
import toast from "../../utils/toast";
const props = defineProps({
  userInfo: {
    type: Object,
  },
});
const confirm = useConfirm();
const data = ref([]);
const initData = ref([]);
const filterText = ref("");
const selected = ref();

const options = [
  { name: "姓名", value: "cus_name" },
  { name: "電話", value: "cus_number" },
  { name: "Email", value: "cus_email" },
  { name: "身分證字號", value: "cus_idnumber" },
  { name: "等級", value: "cus_level" },
  { name: "狀態", value: "cus_status" },
  { name: "備註", value: "cus_remark" },
  { name: "標籤", value: "label_names" },
];

const getAllCusData = async () => {
  const res = await getAllCus();
  data.value = res;
  initData.value = res;
};
const handleFilter = () => {
  if (!selected.value) {
    toast.add({
      severity: "warn",
      summary: "選擇篩選項目",
      life: 3000,
    });
    return;
  }
  if(!filterText.value){
    data.value=initData.value
    return
  }
  if (selected.value?.value === "label_names") {
    const newData =  initData.value.filter((item) => {
          const labelArr = item[selected.value?.value];
          for (let i = 0; i < labelArr.length; i++) {
            if (labelArr[i].label_name.includes(filterText.value)) {
              return true;
            }
          }
          return false;
        })
    data.value = newData;
  } else {
    const newData = initData.value.filter((item) => {
      return item[selected.value?.value].includes(filterText.value);
    });
    data.value = newData;
  }
  toast.add({
    severity: "success",
    summary: "篩選成功",
    life: 3000,
  });
};
const visible = ref(false);
const dialogStatus = ref("add");
const dialogForm = ref({
  cus_name: "",
  cus_number: "",
  cus_email: "",
  cus_idnumber: "",
  cus_level: "",
  cus_status: "",
  cus_remark: "",
  label_name: [],
});
const handleDialogOpen = async (data) => {
  if (!data) {
    dialogStatus.value = "add";
    dialogForm.value = {
      cus_name: "",
      cus_number: "",
      cus_email: "",
      cus_idnumber: "",
      cus_remark: "",
      cus_status: "",
      cus_level: "",
      label_names: [],
    };
  } else {
    dialogStatus.value = "edit";
    dialogForm.value = data;
  }
  visible.value = true;
};

const handleDelete = (data) => {
  // console.log(`output->data`,data)
  confirm.require({
    message: "確認要刪除嗎?",
    header: `刪除客戶--${data.cus_name}`,
    icon: "pi pi-info-circle",
    acceptClass: "p-button-danger",
    accept: async () => {
      await deleteCus({ cus_id: data.id });
      getAllCusData();
      toast.add({
        severity: "info",
        summary: "成功刪除",
        life: 3000,
      });
    },
    reject: () => {
      toast.add({
        severity: "warn",
        summary: "取消刪除",
        life: 3000,
      });
    },
  });
};
onBeforeMount(() => {
  getAllCusData();
});
</script>

<template>
  <div class="dataTable">
    <CusDialog
      v-model:visible="visible"
      v-model:dialogForm="dialogForm"
      :dialogStatus="dialogStatus"
      :getAllCusData="getAllCusData"
    />
    <DataTable
      :value="data"
      :paginator="true"
      :rows="5"
      dataKey="id"
      :rowHover="true"
      responsiveLayout="scroll"
      :rowsPerPageOptions="[5, 10, 20, 50]"
      currentPageReportTemplate="{first} 到 {last} 共 {totalRecords}"
      paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
    >
      <template #header>
        <div class="tableHeader">
          <div>
            <Dropdown
              style="width: 140px"
              v-model="selected"
              :options="options"
              showClear
              optionLabel="name"
              placeholder="選擇篩選"
            />
            <span class="p-input-icon-left">
              <i class="pi pi-search" />
              <InputText
                class="keywordSearch"
                v-model="filterText"
                placeholder="Keyword Search"
              />
            </span>
            <Button label="篩選" @click="handleFilter" />
          </div>
          <Button
            label="新增"
            icon="pi pi-external-link"
            @click="handleDialogOpen()"
          />
        </div>
      </template>
      <Column field="cus_name" header="姓名" style="min-width: 8rem"> </Column>
      <Column field="cus_number" header="電話" style="min-width: 8rem">
      </Column>
      <Column field="cus_email" header="Email" style="min-width: 8rem">
      </Column>
      <Column field="cus_idnumber" header="身分證字號" style="min-width: 8rem">
      </Column>
      <Column field="cus_level" header="等級" style="min-width: 8rem"> </Column>
      <Column field="cus_status" header="狀態" style="min-width: 8rem">
      </Column>
      <Column field="cus_remark" header="備註" style="min-width: 8rem">
      </Column>
      <Column header="標籤" style="min-width: 14rem">
        <template #body="{ data }">
          <span
            style="margin-left: 0.5em; vertical-align: middle"
            v-for="i in data.label_names"
            >{{ i.label_name }}</span
          >
        </template>
      </Column>
      <Column header="操作" style="min-width: 14rem">
        <template #body="{ data }">
          <span>
            <Button
              class="p-button-warning"
              icon="pi pi-user-edit"
              style="margin-right: 5px"
              label="修改"
              severity="warning"
              @click="handleDialogOpen(data)"
            />
            <Button
              class="p-button-danger"
              icon="pi pi-trash"
              label="刪除"
              severity="danger"
              @click="handleDelete(data)"
            />
          </span>
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<style lang="scss" scoped>
.dataTable {
  .tableHeader {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    @media screen and (max-width: 400px) {
      justify-content: center;
      gap: 20px;
      // flex-direction: column-reverse;
    }
    .p-input-icon-left {
      margin-right: 10px;
    }
    .keywordSearch {
      width: 200px;
    }
    @media screen and (max-width: 400px) {
      .keywordSearch {
        width: 120px;
      }
    }
  }
}
</style>
