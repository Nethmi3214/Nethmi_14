const { ClaimItem, Item } = require("./models");
const upload = require("./upload");
const path = require("path");
const fs = require("fs");

const getClaims = (req, res) => {
  ClaimItem.find()
    .sort({ date: -1 })
    .populate("itemId")
    .then((response) => res.json(response))
    .catch((error) => res.status(500).json({ error: error.message }));
};

const getEdit = async (req, res) => {
  try {
    const claim = await ClaimItem.findOne({ id: req.params.id });
    if (!claim) return res.status(404).json({ error: "Claim not found" });

    res.json(claim);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const addClaims = async (req, res) => {
  try {
    const { itemId, name, email, contactNo, description } = req.body;

    if (!itemId || !name || !email || !contactNo) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const item = await Item.findOne({ id: itemId });
    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }

    let imagePath = "";
    if (req.file) {
      imagePath = req.file.filename;
    }
    console.log(imagePath);

    const claim = new ClaimItem({
      userId: 1,
      itemId: item._id,
      name,
      email,
      contactNo,
      description,
      image: imagePath,
    });

    const savedClaim = await claim.save();

    res.status(201).json(savedClaim);
  } catch (error) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      let message = "Duplicate key error";

      if (field === "userId" || field === "itemId")
        message = "This user has already claimed this item.";

      return res.status(400).json({ error: message });
    }

    console.error("addClaims error:", error);
    res.status(500).json({ error: error.message });
  }
};

const updateClaims = async (req, res) => {
  try {
    const { id, name, email, contactNo, description } = req.body;

    if (!id || !name || !email || !contactNo) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const claim = await ClaimItem.findOne({ id: parseInt(id) });
    if (!claim) {
      return res.status(404).json({ error: "Claim not found" });
    }

    let imagePath = claim.image;

    try {
      if (req.file) {
        if (claim.image) {
          const oldPath = path.join(__dirname, "/uploads", claim.image);
          if (fs.existsSync(oldPath)) {
            fs.unlinkSync(oldPath);
          }
        }

        imagePath = req.file.filename;
      }
    } catch (err) {
      console.error("Error inside file handling block:", err);
    }

    claim.name = name;
    claim.email = email;
    claim.contactNo = contactNo;
    claim.description = description;
    claim.image = imagePath;

    const updatedClaim = await claim.save();
    res.status(200).json(updatedClaim);
  } catch (error) {
    console.error("updateClaims error:", error);
    res.status(500).json({ error: error.message });
  }
};

const deleteClaims = async (req, res) => {
  try {
    const id = req.body.id;

    const result = await ClaimItem.deleteOne({ id: id });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Claim not found." });
    }

    res.json({ message: "Claim deleted successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const searchBar = async (req, res) => {
  const search = req.query.search || "";
  const query = {
    $or: [
      { category: { $regex: search, $options: "i" } },
      { itemName: { $regex: search, $options: "i" } },
    ],
  };

  try {
    const items = await Item.find(search ? query : {}).sort({ date: -1 });
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const match = async (req, res) => {
  const { itemName = "", category = "", description = "" } = req.query;

  const query = {
    $and: [],
  };

  if (itemName) {
    query.$and.push({
      itemName: { $regex: itemName, $options: "i" },
    });
  }

  if (category) {
    query.$and.push({
      category: { $regex: category, $options: "i" },
    });
  }

  if (description) {
    query.$and.push({
      description: { $regex: description, $options: "i" },
    });
  }

  const finalQuery = query.$and.length > 0 ? query : {};

  try {
    const items = await Item.find(finalQuery).sort({ date: -1 });
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getClaims,
  getEdit,
  addClaims,
  updateClaims,
  deleteClaims,
  searchBar,
  match,
};
