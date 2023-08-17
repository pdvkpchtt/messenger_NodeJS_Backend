const Yup = require("yup");

const formSchema = Yup.object({
  username: Yup.string().required("Username required"),
  password: Yup.string().required("Password required"),
});

const validateForm = (req, res) => {
  const formData = req.body;

  formSchema
    .validate(formData)
    .catch((err) => {
      res.status(422).send();
      console.log(err.errors);
    })
    .then((valid) => {
      if (valid) {
        // res.status(200).send();
        console.log("form is good");
      }
    });
};

module.exports = validateForm;
