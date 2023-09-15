const express = require("express")
const app = express()
const fs = require("fs")

const dataCars = fs.readFileSync(`${__dirname}/data/data.json`, "utf-8")
const dataCarsJson = [...JSON.parse(dataCars)]

function isRequiredPropsExist(props) {
  const requiredProps = ["id", "plate", "manufacture", "model"]
  for(const prop of requiredProps) {
    if(typeof props[prop] === "undefined") {
      return false
    }
  }
  return true
}

function setHeader(res) {
  res.set({
    "Content-type": "application/json",
  })
}

function isArrayofStrings(arr) {
  return Array.isArray(arr) && arr.every((element) => typeof element === "string");
}

app.get("/", (req, res) => {
  setHeader(res)
  res.status(200).json({ 
    message: "ping successfully",
  })
})

app.get("/cars", (req, res) => {
  setHeader(res)
  res.status(200).json(dataCarsJson)
})

app.get("/cars/:id", (req, res) => {
  setHeader(res)

  const id = req.params.id

  for(let i = 0; i < dataCarsJson.length; i++) {
    if(dataCarsJson[i].id === id) {
      return res.status(200).json(dataCarsJson[i])
    }
  }
  
  res.status(404).json({ 
    message: "Data dengan id tersebut tidak ditemukan",
  })
})

app.post("/cars", (req, res) => {
  setHeader(res)

  if(isRequiredPropsExist(req.body)) {
    const { id, plate, manufacture, model, image, rentPerDay, capacity, description, availableAt, transmission, available, type, year, options, specs } = req.body
    const addedCar = {
      id,
      plate,
      manufacture,
      model,
      image: typeof image === "string" ? image : "",
      rentPerDay: typeof rentPerDay === "number" ? rentPerDay : 0,
      capacity: typeof capacity === "number" ? capacity : 1,
      description: typeof description === "string" ? description : "",
      availableAt: typeof availableAt === "string" ? availableAt : new Date().toISOString(),
      transmission: typeof transmission === "string" ? transmission : "",
      available: typeof available === "boolean" ? available : true,
      type: typeof type === "string" ? type : "",
      year: typeof year === "number" ? year : new Date().getFullYear(),
      options: isArrayofStrings(options) ? options : [],
      specs: isArrayofStrings(specs) ? specs : []
    }
    dataCarsJson.push(addedCar)
    return res.status(201).json(dataCarsJson)
  }
  res.status(400).json({ 
    message: "Request body harus memiliki id, plate, manufacture, dan model",
  })
})

app.put("/cars/:id", (req, res) => {
  setHeader(res)
  
  const id = req.params.id

  for(let i = 0; i < dataCarsJson.length; i++) {
    if(dataCarsJson[i].id === id) {
      const { plate, manufacture, model, image, rentPerDay, capacity, description, availableAt, transmission, available, type, year, options, specs } = req.body
      const updatedCar = {
        id: dataCarsJson[i].id,
        plate: typeof model === "string" ? plate : dataCarsJson[i].plate,
        manufacture: typeof model === "string" ? manufacture : dataCarsJson[i].manufacture,
        model: typeof model === "string" ? model : dataCarsJson[i].model,
        image: typeof image === "string" ? image : dataCarsJson[i].image,
        rentPerDay: typeof rentPerDay === "number" ? rentPerDay : dataCarsJson[i].rentPerDay,
        capacity: typeof capacity === "number" ? capacity : dataCarsJson[i].capacity,
        description: typeof description === "string" ? description : dataCarsJson[i].description,
        availableAt: typeof availableAt === "string" ? availableAt : dataCarsJson[i].availableAt,
        transmission: typeof transmission === "string" ? transmission : dataCarsJson[i].transmission,
        available: typeof available === "boolean" ? available : dataCarsJson[i].available,
        type: typeof type === "string" ? type : dataCarsJson[i].type,
        year: typeof year === "number" ? year : dataCarsJson[i].year,
        options: isArrayofStrings(options) ? options : dataCarsJson[i].options,
        specs: isArrayofStrings(specs) ? specs : dataCarsJson[i].specs
      }
      dataCarsJson[i] = updatedCar
      return res.status(201).json(updatedCar)
    }
  }
  res.status(404).json({ 
    message: "Data dengan id tersebut tidak ditemukan",
  })
})

app.delete("/cars/:id", (req, res) => {
  setHeader(res)
  const id = req.params.id

  for(let i = 0; i < dataCarsJson.length; i++) {
    if(dataCarsJson[i].id === id) {
      const deletedCar = dataCarsJson[i]
      dataCarsJson.splice(i, 1)
      return res.status(200).json(deletedCar)
    }
  }
  res.status(404).json({ 
    message: "Data dengan id tersebut tidak ditemukan",
  })
})

app.listen(8000, () => {
  console.log("Server Berjalan")
})