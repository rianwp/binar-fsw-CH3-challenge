const express = require("express")
const app = express()
const fs = require("fs")

const dataCarsJson = fs.readFileSync(`${__dirname}/data/data.json`, "utf-8")
const dataCars = [...JSON.parse(dataCarsJson)]

function isRequiredPropsValid(props) {
  const requiredProps = ["id", "plate", "manufacture", "model"]
  for(const prop of requiredProps) {
    if(typeof props[prop] !== "string") {
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
  res.status(200).json(dataCars)
})

app.get("/cars/:id", (req, res) => {
  setHeader(res)

  const id = req.params.id

  for(let i = 0; i < dataCars.length; i++) {
    if(dataCars[i].id === id) {
      return res.status(200).json(dataCars[i])
    }
  }
  
  res.status(404).json({ 
    message: "Data dengan id tersebut tidak ditemukan",
  })
})

app.post("/cars", (req, res) => {
  setHeader(res)

  if(isRequiredPropsValid(req.body)) {
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
    dataCars.push(addedCar)
    return res.status(201).json(dataCars)
  }
  res.status(400).json({ 
    message: "Request body harus memiliki id, plate, manufacture, dan model dengan format string",
  })
})

app.put("/cars/:id", (req, res) => {
  setHeader(res)
  
  const id = req.params.id

  for(let i = 0; i < dataCars.length; i++) {
    if(dataCars[i].id === id) {
      const { plate, manufacture, model, image, rentPerDay, capacity, description, availableAt, transmission, available, type, year, options, specs } = req.body
      const updatedCar = {
        id: dataCars[i].id,
        plate: typeof model === "string" ? plate : dataCars[i].plate,
        manufacture: typeof model === "string" ? manufacture : dataCars[i].manufacture,
        model: typeof model === "string" ? model : dataCars[i].model,
        image: typeof image === "string" ? image : dataCars[i].image,
        rentPerDay: typeof rentPerDay === "number" ? rentPerDay : dataCars[i].rentPerDay,
        capacity: typeof capacity === "number" ? capacity : dataCars[i].capacity,
        description: typeof description === "string" ? description : dataCars[i].description,
        availableAt: typeof availableAt === "string" ? availableAt : dataCars[i].availableAt,
        transmission: typeof transmission === "string" ? transmission : dataCars[i].transmission,
        available: typeof available === "boolean" ? available : dataCars[i].available,
        type: typeof type === "string" ? type : dataCars[i].type,
        year: typeof year === "number" ? year : dataCars[i].year,
        options: isArrayofStrings(options) ? options : dataCars[i].options,
        specs: isArrayofStrings(specs) ? specs : dataCars[i].specs
      }
      dataCars[i] = updatedCar
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

  for(let i = 0; i < dataCars.length; i++) {
    if(dataCars[i].id === id) {
      const deletedCar = dataCars[i]
      dataCars.splice(i, 1)
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