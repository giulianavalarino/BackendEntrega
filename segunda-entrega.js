const fs = require('fs')

class ProductManager {
  constructor(fileName) {
    this.fileName = fileName
  }
  async addProduct(title, description, price, thumbnail, code, stock) {
    const newProduct = { title, description, price, thumbnail, code, stock }
    try {
      const data = await fs.promises.readFile(`./${this.fileName}`, 'utf-8'),
        jsonData = JSON.parse(data)
      if (jsonData.find(prod => prod.code === code)) {
        console.log(`The code ${code} it's already used in the database`)
      } else if (
        !title ||
        !description ||
        !price ||
        !thumbnail ||
        !code ||
        !stock
      ) {
        console.log('All fields are required')
        return
      }

      if (jsonData.length > 0) {
        const lastId = jsonData[jsonData.length - 1].id
        newProduct.id = lastId + 1
      } else {
        newProduct.id = 1
      }

      jsonData.push(newProduct)
      fs.writeFileSync(`./${this.fileName}`, JSON.stringify(jsonData, null, 2))
    } catch (err) {
      throw new Error(err)
    }
  }
  async getById(num) {
    try {
      const data = await fs.promises.readFile(`./${this.fileName}`, 'utf-8'),
        jsonData = JSON.parse(data),
        found = jsonData.find(element => element.id === num)
      if (found) {
        console.log(found)
      } else {
        console.log(`ID "${num}" not found`)
      }
    } catch (err) {
      throw new Error(err)
    }
  }
  async getAll() {
    try {
      const data = await fs.promises.readFile(`./${this.fileName}`, 'utf-8'),
        jsonData = JSON.parse(data)
      console.log(`All the data: ${JSON.stringify(jsonData, null, 2)}`)
    } catch (err) {
      throw new Error(err)
    }
  }
  async deleteById(num) {
    try {
      const data = await fs.promises.readFile(`./${this.fileName}`, 'utf-8'),
        jsonData = JSON.parse(data),
        foundIndex = jsonData.findIndex(element => element.id === num)
      if (foundIndex !== -1) {
        jsonData.splice(foundIndex, 1)
        fs.writeFileSync(
          `./${this.fileName}`,
          JSON.stringify(jsonData, null, 2)
        )
      } else {
        console.log(`ID "${num}" not found`)
      }
    } catch (err) {
      throw new Error(err)
    }
  }
  deleteAll() {
    fs.writeFileSync(`./${this.fileName}`, '[]')
  }
}

// Líneas usadas para crear el archivo:
const firstProduct = [
  {
    title: 'pencil',
    description: 'lorem ipsum',
    price: 10,
    thumbnail: 'pencil.svg',
    code: 'A1',
    stock: 100,
    id: 2
  }
]
fs.writeFileSync('./products.txt', JSON.stringify(firstProduct, null, 2))

const products = new ProductManager('products.txt')

// Ejemplos de uso (ejecutar uno por vez):

// products.addProduct('rule', 'lorem ipsum', 'rule.svg', 3.55, 'A2', 50)

// products.getById(2)

// products.getAll()

// products.deleteById(2)

// products.deleteAll()
