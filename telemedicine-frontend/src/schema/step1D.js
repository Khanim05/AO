import * as Yup from "yup";

const step1Schema = Yup.object({
  Name: Yup.string().required("Ad daxil edilməlidir"),
  Surname: Yup.string().required("Soyad daxil edilməlidir"),
  // username: Yup.string().required("İstifadəçi adı daxil edilməlidir"),
  Email: Yup.string()
    .email("Email düzgün formatda deyil")
    .required("Email daxil edilməlidir"),
  BirthDate: Yup.date()
    .required("Doğum tarixi seçilməlidir")
    .max(new Date(), "Doğum tarixi keçmiş tarix olmalıdır"),
});

export default step1Schema;
