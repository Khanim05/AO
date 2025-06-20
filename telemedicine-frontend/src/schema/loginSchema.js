import * as Yup from "yup";

const Loginschema = Yup.object({
  Email: Yup.string().email("Email düzgün formatda deyil").required("Email daxil edilməlidir"),
  Password: Yup.string().min(6, "Şifrə ən az 6 simvol olmalıdır")
  .matches(/[A-Z]/, "Ən azı 1 böyük hərf daxil edin")
  .matches(/[^a-zA-Z0-9]/, "Ən azı 1 xüsusi simvol daxil edin")
  .required("Şifrə daxil edilməlidir")
});

export default Loginschema;