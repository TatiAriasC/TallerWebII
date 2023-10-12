const express = require('express');
const fs = require('fs');
const dataPath = 'carros.json';

const app = express();
app.use(express.json());


// Ruta para obtener todos los carros
app.get('/carros', (req, res) => {
  fs.readFile(dataPath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'No se pudo obtener la lista de los carros.' });
    }
    const carros = JSON.parse(data);
    res.json(carros);
  });
});

// Ruta para obtener un carro por ID
app.get('/carros/:carroId', (req, res) => {
  const carroId = parseInt(req.params.carroId);
  fs.readFile(dataPath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'No se pudo obtener la información del carro solicitado.' });
    }
    const carros = JSON.parse(data);
    const carro = carros.find((s) => s.id === carroId);
    if (!carro) {
      return res.status(404).json({ error: 'Carro no encontrado.' });
    }
    res.json(carro);
  });
});

// Ruta para agregar un nuevo carro
app.post('/carros', (req, res) => {
  fs.readFile(dataPath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'No se pudo agregar el carro.' });
    }
    const carros = JSON.parse(data);
    const newCarro = req.body;
    newCarro.id = carros.length + 1;
    carros.push(newCarro);

    fs.writeFile(dataPath, JSON.stringify(carros, null, 2), (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'No se pudo agregar el carro.' });
      }
      res.status(201).json(newCarro);
    });
  });
});

// Ruta para actualizar un carro por ID
app.put('/carros/:carroId', (req, res) => {
  const carroId = parseInt(req.params.carroId);
  fs.readFile(dataPath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'No se pudo actualizar la información del carro.' });
    }
    let carros = JSON.parse(data);
    const updatedCarro = req.body;
    carros = carros.map((carro) =>
      carro.id === carroId ? { ...carro, ...updatedCarro } : carro
    );

    fs.writeFile(dataPath, JSON.stringify(carros, null, 2), (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'No se pudo actualizar la información del carro.' });
      }
      res.json(updatedCarro);
    });
  });
});

// Ruta para eliminar un carro por ID
app.delete('/carros/:carroId', (req, res) => {
  const carroId = parseInt(req.params.carroId);
  fs.readFile(dataPath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'No se pudo eliminar el carro.' });
    }
    let carros = JSON.parse(data);
    const index = carros.findIndex((carro) => carro.id === carroId);
    if (index === -1) {
      return res.status(404).json({ error: 'Carro no encontrado.' });
    }
    const deletedCarro = carros.splice(index, 1)[0];

    fs.writeFile(dataPath, JSON.stringify(carros, null, 2), (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'No se pudo eliminar el carro.' });
      }
      res.json(deletedCarro);
    });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor en ejecución en el puerto ${PORT}`);
});
