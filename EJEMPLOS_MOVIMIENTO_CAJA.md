# 📋 EJEMPLOS DE USO - MOVIMIENTO CAJA

## ✅ CORRECCIONES APLICADAS

### **Problema Solucionado:**
- ❌ `"El monto debe ser un número decimal válido"`
- ❌ `"El ID del pago debe ser un UUID válido"`

### **Soluciones Implementadas:**
- ✅ Cambiado `@IsDecimal` por `@IsNumber` para validación de monto
- ✅ Mejorada validación de `idPago` opcional
- ✅ Agregado `@Transform` para manejar strings vacíos en `idPago`

---

## 🚀 EJEMPLOS DE USO CORRECTOS

### **1. INGRESO SIN PAGO ASOCIADO:**
```json
POST /movimiento-caja

{
  "tipo": "INGRESO",
  "concepto": "Pago de alquiler - Local 101",
  "monto": 250.50,
  "idCaja": "123e4567-e89b-12d3-a456-426614174000",
  "descripcion": "Pago recibido en efectivo"
}
```

### **2. INGRESO CON PAGO ASOCIADO:**
```json
POST /movimiento-caja

{
  "tipo": "INGRESO",
  "concepto": "Pago de servicios comunes",
  "monto": 150.00,
  "idCaja": "123e4567-e89b-12d3-a456-426614174000",
  "idPago": "987e6543-e21b-32d1-b654-321987654321",
  "descripcion": "Pago procesado automáticamente",
  "comprobanteUrl": "https://storage.com/comprobante-001.pdf"
}
```

### **3. EGRESO:**
```json
POST /movimiento-caja

{
  "tipo": "EGRESO",
  "concepto": "Compra de suministros de limpieza",
  "monto": 75.25,
  "idCaja": "123e4567-e89b-12d3-a456-426614174000",
  "descripcion": "Productos de limpieza para áreas comunes"
}
```

### **4. AJUSTE:**
```json
POST /movimiento-caja

{
  "tipo": "AJUSTE",
  "concepto": "Corrección por error de captura",
  "monto": -10.00,
  "idCaja": "123e4567-e89b-12d3-a456-426614174000",
  "descripcion": "Ajuste negativo por sobrante detectado"
}
```

---

## 🔧 VALIDACIONES IMPLEMENTADAS

### **Monto:**
- ✅ Debe ser un número válido
- ✅ Máximo 2 decimales
- ✅ Mínimo 0.01
- ✅ Acepta números decimales: `250.50`, `100`, `1.5`

### **idPago (Opcional):**
- ✅ Puede ser omitido completamente
- ✅ Puede enviarse como `null` o string vacío
- ✅ Si se envía, debe ser UUID válido
- ✅ Se transforma automáticamente: `""` → `undefined`

### **Tipos de Movimiento:**
- ✅ `"INGRESO"` - Suma al saldo de caja
- ✅ `"EGRESO"` - Resta del saldo de caja
- ✅ `"AJUSTE"` - Suma/resta según el signo del monto

---

## 📊 COMPORTAMIENTO DEL SALDO

Al crear un movimiento:

1. **Se registra el movimiento** en `movimiento_caja`
2. **Se actualiza automáticamente** el `montoFinal` en `caja`:
   - **INGRESO:** `saldoActual + monto`
   - **EGRESO:** `saldoActual - monto` 
   - **AJUSTE:** `saldoActual + monto` (monto puede ser negativo)

### **Ejemplo de Flujo:**
```
Saldo inicial: S/ 1000.00

INGRESO +250.50  → Saldo: S/ 1250.50
EGRESO  -75.25   → Saldo: S/ 1175.25
AJUSTE  -10.00   → Saldo: S/ 1165.25
```

---

## 🎯 ERRORES COMUNES EVITADOS

### **❌ ANTES (Errores):**
```json
{
  "monto": "250.50",        // String en lugar de número
  "idPago": ""              // String vacío causaba error UUID
}
```

### **✅ AHORA (Correcto):**
```json
{
  "monto": 250.50,          // Número directo o string que se convierte
  "idPago": null            // null, undefined, o UUID válido
}
```

---

**¡Ahora MovimientoCaja funciona correctamente con validaciones mejoradas!** 🚀