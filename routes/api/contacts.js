const express = require("express");
const {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContacts,
  updateStatusContact,
} = require("../../models/contacts");

const {
  validateId,
  validator,
  favoriteValidate,
} = require("../../utils/validator");
const validateToken = require("../../utils/tokenValidator");

const router = express.Router();

router.use(validateToken);

router.get("/", async (req, res, next) => {
  try {
    const contacts = await listContacts(req.user);
    res.json(contacts);
  } catch (error) {
    next(error);
  }
});

router.get("/:contactId", validateId, async (req, res, next) => {
  const contact = await getContactById(req.params.contactId);
  try {
    if (contact) {
      res.json(contact);
    } else {
      res.status(404).json({ message: "Not found" });
    }
  } catch (error) {
    next(error);
  }
});

router.post("/", validator, async (req, res, next) => {
  try {
    const { _id: owner } = req.user;
    const newContact = await addContact(req.body, owner);
    res.status(201).json(newContact);
  } catch (error) {
    next(error);
  }
});

router.delete("/:contactId", validateId, async (req, res, next) => {
  try {
    const deletedCount = await removeContact(req.params.contactId);
    console.log(deletedCount);
    if (deletedCount) {
      res.status(200).json({ message: "Contact deleted" });
    } else {
      res.status(404).json({ message: "Not Found" });
    }
  } catch (error) {
    next(error);
  }
});

router.put("/:contactId", validateId, validator, async (req, res, next) => {
  try {
    const contacts = await updateContacts(req.params.contactId, req.body);
    if (contacts) {
      res.json(contacts);
    } else {
      res.status(404).json({ message: "Not Found" });
    }
  } catch (error) {
    next(error);
  }
});

router.patch(
  "/:contactId/favorite",
  validateId,
  favoriteValidate,
  async (req, res, next) => {
    const contact = await updateStatusContact(req.params.contactId, req.body);
    try {
      if (!contact) {
        res.status(404).json({ message: "Not found" });
      }
      if (!req.body) {
        res.status(400).json({ message: "missing field favorite" });
      } else {
        res.json(contact);
      }
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
