<script>
import { getAllCus, deleteCus, createCus, editCus } from "@/api/cus";
import { Message } from "element-ui";
import { createLabel, getLabel } from "@/api/label";

export default {
  name: "",
  props: {},
  data() {
    return {
      data: [],
      initData: [],
      currentPage: 1,
      pageSize: 5,
      loading: true,
      filterText: "",
      selected: "",
      options: [
        { name: "姓名", value: "cus_name" },
        { name: "電話", value: "cus_number" },
        { name: "Email", value: "cus_email" },
        { name: "身分證字號", value: "cus_idnumber" },
        { name: "等級", value: "cus_level" },
        { name: "狀態", value: "cus_status" },
        { name: "備註", value: "cus_remark" },
        { name: "標籤", value: "label_names" },
      ],
      dialogFormVisible: false,
      dialogStatus: "add",
      dialogForm: {
        cus_name: "",
        cus_number: "",
        cus_email: "",
        cus_idnumber: "",
        cus_remark: "",
        cus_status: "",
        cus_level: "",
        label_name: [],
      },
      levelOptions: ["銅", "銀", "金", "白金"],
      statusOptions: ["新客戶", "舊客戶", "潛在客戶"],
      dialogFormRules: {
        cus_name: [{ required: true, message: "請輸入姓名" }],
        cus_number: [{ required: true, message: "請輸入電話" }],
        cus_email: [{ required: true, message: "請輸入Email" }],
        cus_idnumber: [{ required: true, message: "請輸入身分證字號" }],
        cus_status: [{ required: true, message: "請選擇狀態" }],
        cus_level: [{ required: true, message: "請選擇等級" }],
      },
      addLabelText: "",
      labelList: [],
    };
  },
  computed: {
    compData() {
      return this.data.slice(
        (this.currentPage - 1) * this.pageSize,
        this.currentPage * this.pageSize
      );
    },
    total() {
      return this.data.length;
    },
  },
  methods: {
    async getAllCusData() {
      this.loading = true;
      const res = await getAllCus();
      this.data = res;
      this.initData = res;
      this.loading = false;
    },

    async handleDelete(data) {
      try {
        await this.$confirm("確認要刪除嗎?", `刪除客戶--${data.cus_name}`, {
          confirmButtonText: "確認",
          cancelButtonText: "取消",
          type: "warning",
        });
        await deleteCus({ cus_id: data.id });
        await this.getAllCusData();
        Message({ message: "删除成功!", type: "success" });
      } catch (err) {
        Message({ message: "已取消删除", type: "info" });
      }
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.currentPage = 1;
    },
    handleCurrentChange(val) {
      this.currentPage = val;
    },
    handleFilter() {
      if (!this.selected) {
        Message({ message: "選擇篩選項目", type: "warning" });
        return;
      }
      if (!this.filterText) {
        this.data = this.initData;
        return;
      }
      if (this.selected === "label_names") {
        const newData = this.initData.filter((item) => {
          const labelArr = item[this.selected];
          for (let i = 0; i < labelArr.length; i++) {
            if (labelArr[i].label_name.includes(this.filterText)) {
              return true;
            }
          }
          return false;
        });
        this.data = newData;
      } else {
        const newData = this.initData.filter((item) => {
          return item[this.selected].includes(this.filterText);
        });
        this.data = newData;
      }
      Message({ message: "篩選成功", type: "success" });
    },
    async handleDialogOpen(data) {
      if (!data) {
        this.dialogStatus = "add";
        this.dialogForm = {
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
        this.dialogStatus = "edit";
        data.label_names = data.label_names.map(({ id, label_name }) => ({
          value: id?.toString(),
          label_name,
        }));
        this.dialogForm = data;
      }
      this.dialogFormVisible = true;
    },
    async handleSubmit() {
      this.$refs["dialogForm"].validate(async (valid) => {
        if (valid) {
          let message;
          if (this.dialogStatus === "add") {
            await createCus(this.dialogForm);
            message = "新增成功";
          }
          if (this.dialogStatus === "edit") {
            const submitData = { ...this.dialogForm };
            submitData.label_names = submitData.label_names.map(
              ({ value, label_name }) => ({
                id: value,
                label_name,
              })
            );

            await editCus(submitData);
            message = "修改成功";
          }
          await this.getAllCusData();
          Message({ message, type: "success" });
          this.dialogFormVisible = false;
        } else {
          console.error(this.dialogForm);
        }
      });
    },
    async handleAddLabel() {
      await createLabel({ label_name: this.addLabelText });
      await this.initLabelData();
      Message({ message: "新增成功", type: "success" });
    },
    async initLabelData() {
      const labelData = await getLabel();
      this.labelList = labelData.map(({ id, label_name }) => ({
        value: id,
        label_name,
      }));
    },
  },
  watch: {
    dialogFormVisible(newVal) {
      if (newVal === false) {
        this.$refs["dialogForm"].resetFields();
      }
    },
    dialogStatus(newVal) {
      if (newVal === "edit") {
        this.initLabelData();
      }
    },
  },
  created() {
    this.getAllCusData();
  },
};
</script>
<template>
  <div class="cus">
    <el-dialog
      :title="dialogStatus === 'add' ? '新增客戶' : '修改客戶'"
      :visible.sync="dialogFormVisible"
      width="600px"
    >
      <el-form :model="dialogForm" :rules="dialogFormRules" ref="dialogForm">
        <el-form-item label="姓名" prop="cus_name">
          <el-input v-model="dialogForm.cus_name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="電話" prop="cus_number">
          <el-input
            v-model="dialogForm.cus_number"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="E-mail" prop="cus_email">
          <el-input
            v-model="dialogForm.cus_email"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="身分證字號" prop="cus_idnumber">
          <el-input
            v-model="dialogForm.cus_idnumber"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="等級" prop="cus_level">
          <el-select v-model="dialogForm.cus_level">
            <el-option
              v-for="item in levelOptions"
              :key="item"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="狀態" prop="cus_status">
          <el-select v-model="dialogForm.cus_status">
            <el-option
              v-for="item in statusOptions"
              :key="item"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="備註" prop="cus_remark">
          <el-input
            type="textarea"
            :autosize="{ minRows: 3, maxRows: 4 }"
            v-model="dialogForm.cus_remark"
          ></el-input>
        </el-form-item>
        <template v-if="dialogStatus === 'edit'">
          <el-form-item label="新增標籤">
            <el-input v-model="addLabelText" />
            <el-button type="primary" @click="handleAddLabel">
              新增標籤
            </el-button>
          </el-form-item>
          <el-form-item label="標籤">
            <el-select
              v-model="dialogForm.label_names"
              multiple
              placeholder="请選擇"
            >
              <el-option
                v-for="item in labelList"
                :key="item.label_name"
                :label="item.label_name"
                :value="item"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </template>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSubmit">確定</el-button>
      </div>
    </el-dialog>
    <div class="cus-header">
      <div class="filter-area">
        <el-select v-model="selected" clearable placeholder="選擇篩選">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.name"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <el-input
          v-model="filterText"
          prefix-icon="el-icon-search"
          placeholder="Keyword Search"
        />
        <el-button type="primary" @click="handleFilter"> 篩選 </el-button>
      </div>
      <el-button type="primary" @click="handleDialogOpen()"> 新增 </el-button>
    </div>
    <el-table :data="compData" v-loading="loading" border style="width: 100%">
      <el-table-column prop="id" label="ID" align="center"> </el-table-column>
      <el-table-column prop="cus_name" label="姓名" align="center">
      </el-table-column>
      <el-table-column prop="cus_number" label="電話" align="center">
      </el-table-column>
      <el-table-column prop="cus_email" label="Email" align="center">
      </el-table-column>
      <el-table-column prop="cus_idnumber" label="身分證字號" align="center">
      </el-table-column>
      <el-table-column prop="cus_level" label="等級" align="center">
      </el-table-column>
      <el-table-column prop="cus_status" label="狀態" align="center">
      </el-table-column>
      <el-table-column prop="cus_remark" label="備註" align="center">
      </el-table-column>
      <el-table-column label="標籤" align="center">
        <template slot-scope="scope">
          <div
            v-if="scope.row"
            :key="i.label_name"
            v-for="i in scope.row.label_names"
          >
            {{ i.label_name }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="200">
        <template v-slot:default="scope">
          <el-button
            @click="handleDialogOpen({ ...scope.row })"
            type="warning"
            size="mini"
            icon="el-icon-edit"
          >
            修改
          </el-button>
          <el-button
            @click="handleDelete(scope.row)"
            type="danger"
            size="mini"
            icon="el-icon-delete"
          >
            刪除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[5, 10, 20, 30, 50]"
      :page-size="100"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
  </div>
</template>
<style lang="scss">
.cus {
  .cus-header {
    // width: 100%;
    padding: 20px;
    display: flex;
    justify-content: space-between;
    .filter-area {
      display: flex;
      flex-wrap: nowrap;
      .el-input {
        width: 200px;
      }
      .el-select {
        width: 150px;
        margin-right: 60px;
      }
    }
  }
  .el-dialog__body {
    padding: 10px;
    .el-form-item {
      margin-bottom: 17px;
    }
  }
  .el-table {
    overflow-x: scroll;
    &::-webkit-scrollbar {
      display: none;
    }
  }
  .el-pagination {
    display: flex;
    justify-content: center;
  }
}
</style>
