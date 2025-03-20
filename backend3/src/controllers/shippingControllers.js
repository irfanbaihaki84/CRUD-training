const db = require('../config/db');

// Create Pengiriman
const createPengiriman = (req, res) => {
  const {
    id_pengiriman,
    id_pelanggan,
    id_kurir,
    nama_pengirim,
    alamat_pengirim,
    nama_penerima,
    alamat_penerima,
    berat,
    biaya,
    status_pengiriman,
    tanggal_pengiriman,
    tanggal_diterima,
  } = req.body;

  const query = `
        INSERT INTO pengiriman (
            id_pengiriman, id_pelanggan, id_kurir, nama_pengirim, alamat_pengirim, 
            nama_penerima, alamat_penerima, berat, biaya, status_pengiriman, 
            tanggal_pengiriman, tanggal_diterima
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

  db.query(
    query,
    [
      id_pengiriman,
      id_pelanggan,
      id_kurir,
      nama_pengirim,
      alamat_pengirim,
      nama_penerima,
      alamat_penerima,
      berat,
      biaya,
      status_pengiriman,
      tanggal_pengiriman,
      tanggal_diterima,
    ],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({
        message: 'Pengiriman created successfully',
        id: result.insertId,
      });
    }
  );
};

// Read All Pengiriman
const getAllPengiriman = (req, res) => {
  const query = 'SELECT * FROM pengiriman';
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

// Read Pengiriman by ID
const getPengirimanById = (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM pengiriman WHERE id = ?';
  db.query(query, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0)
      return res.status(404).json({ error: 'Pengiriman not found' });
    res.json(results[0]);
  });
};

// Update All Data Pengiriman
const updatePengiriman = (req, res) => {
  const { id } = req.params;
  const {
    id_pengiriman,
    id_pelanggan,
    id_kurir,
    nama_pengirim,
    alamat_pengirim,
    nama_penerima,
    alamat_penerima,
    berat,
    biaya,
    status_pengiriman,
    tanggal_pengiriman,
    tanggal_diterima,
  } = req.body;

  const query = `
        UPDATE pengiriman SET
            id_pengiriman = ?, id_pelanggan = ?, id_kurir = ?, nama_pengirim = ?, 
            alamat_pengirim = ?, nama_penerima = ?, alamat_penerima = ?, berat = ?, 
            biaya = ?, status_pengiriman = ?, tanggal_pengiriman = ?, tanggal_diterima = ?
        WHERE id = ?
    `;

  db.query(
    query,
    [
      id_pengiriman,
      id_pelanggan,
      id_kurir,
      nama_pengirim,
      alamat_pengirim,
      nama_penerima,
      alamat_penerima,
      berat,
      biaya,
      status_pengiriman,
      tanggal_pengiriman,
      tanggal_diterima,
      id,
    ],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (result.affectedRows === 0)
        return res.status(404).json({ error: 'Pengiriman not found' });
      res.json({ message: 'Pengiriman updated successfully' });
    }
  );
};

// Partial Update Pengiriman (Update Sebagian Data)
const partialUpdatePengiriman = (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ error: 'No fields to update' });
  }

  const query = 'UPDATE pengiriman SET ? WHERE id = ?';
  db.query(query, [updates, id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0)
      return res.status(404).json({ error: 'Pengiriman not found' });
    res.json({ message: 'Pengiriman partially updated successfully' });
  });
};

// Delete Pengiriman
const deletePengiriman = (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM pengiriman WHERE id = ?';
  db.query(query, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0)
      return res.status(404).json({ error: 'Pengiriman not found' });
    res.json({ message: 'Pengiriman deleted successfully' });
  });
};

module.exports = {
  createPengiriman,
  getAllPengiriman,
  getPengirimanById,
  updatePengiriman,
  partialUpdatePengiriman,
  deletePengiriman,
};
