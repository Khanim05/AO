import * as Yup from "yup";

const Loginschema = Yup.object({
  Email: Yup.string().email("Email düzgün formatda deyil").required("Email daxil edilməlidir"),
  Password: Yup.string().required("Şifrə daxil edilməlidir")
});

export default Loginschema;