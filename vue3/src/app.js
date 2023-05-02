import { createApp } from 'vue'
import App from './App.vue'
import "./assets/style.css"
import "primevue/resources/themes/saga-blue/theme.css";
import "primevue/resources/primevue.min.css";
import "primeicons/primeicons.css";    
import PrimeVue from 'primevue/config';
import ToastService from "primevue/toastservice";
import Button from 'primevue/button';
import InputText from "primevue/inputtext";
import Card from "primevue/card";
import Toast from 'primevue/toast';
import Password from "primevue/password";
import TabMenu from "primevue/tabmenu";
import Chip from "primevue/chip";
import Avatar from "primevue/avatar";
import Dialog from "primevue/dialog";
import Menu from "primevue/menu";
import InlineMessage from "primevue/message";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Dropdown from "primevue/dropdown";
import Textarea from "primevue/textarea";
import ConfirmDialog from "primevue/confirmdialog";
import ConfirmationService from "primevue/confirmationservice";
import MultiSelect from "primevue/multiselect";
const app = createApp(App);
app.component("Button", Button);
app.component("Card", Card);
app.component("InputText", InputText);
app.component("Toast", Toast);
app.component("Password", Password);
app.component("TabMenu", TabMenu);
app.component("Chip", Chip); //標籤
app.component("Avatar", Avatar); 
app.component("Dialog", Dialog); 
app.component("Menu", Menu); 
app.component("InlineMessage", InlineMessage);
app.component("DataTable", DataTable);
app.component("Column", Column);
app.component("Dropdown", Dropdown);
app.component("Textarea", Textarea);
app.component("ConfirmDialog", ConfirmDialog);
app.component("MultiSelect", MultiSelect);
app.use(PrimeVue);
app.use(ToastService);
app.use(ConfirmationService);

export default app