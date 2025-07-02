import * as Yup from "yup";

const schema = Yup.object({
  Name: Yup.string().required("Ad daxil edilməlidir"),
  Surname: Yup.string().required("Soyad daxil edilməlidir"),
  Email: Yup.string()
    .email("Email düzgün formatda deyil")
    .required("Email daxil edilməlidir"),
  Password: Yup.string()
    .min(6, "Şifrə ən az 6 simvol olmalıdır")
    .matches(/[A-Z]/, "Ən azı 1 böyük hərf daxil edin")
    .matches(/[^a-zA-Z0-9]/, "Ən azı 1 xüsusi simvol daxil edin")
    .required("Şifrə daxil edilməlidir"),
  ConfirmPassword: Yup.string()
    .oneOf([Yup.ref("Password")], "Şifrələr uyğun deyil")
    .required("Təkrar şifrə daxil edilməlidir"),
  BirthDate: Yup.date()
    .required("Doğum tarixi seçilməlidir")
    .max(new Date(), "Doğum tarixi keçmiş tarix olmalıdır"),
});

export default schema;
