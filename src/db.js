
import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const productsPath = path.resolve(__dirname, '../products.json')

export async function readProducts() {
  try {
    const content = await readFile(productsPath, 'utf8')
    return JSON.parse(content)
  } catch (err) {
    if (err.code === 'ENOENT') {
      return []
    }

    throw err
  }
}

export async function writeProducts(products) {
  await writeFile(
    productsPath,
    JSON.stringify(products, null, 2),
    'utf8'
  )
}
