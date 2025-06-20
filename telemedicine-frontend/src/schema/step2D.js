import * as Yup from "yup";

const step2Schema = Yup.object().shape({
  CategoryId: Yup.string().required("Kateqoriya mütləqdir"),
  LicenseNumber: Yup.number()
    .required("Təcrübə ili mütləqdir")
    .min(1, "Ən azı 1 il")
    .max(40, "40 ildən çox ola bilməz"),
  Password: Yup.string().required("Şifrə mütləqdir").min(6, "Minimum 6 simvol"),
  ConfirmPassword: Yup.string()
    .required("Şifrə təkrar mütləqdir")
    .oneOf([Yup.ref("Password")], "Şifrələr uyğun gəlmir"),
});

export default step2Schema;
