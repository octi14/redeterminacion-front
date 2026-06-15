# Contrato API: declaraciones juradas de cementerio

## Reglas de dominio

- Una funeraria puede tener varios usuarios con rol `cementerio`.
- Cada usuario `cementerio` sólo opera sobre la funeraria asociada.
- `master` debe enviar `funerariaId` cuando crea información en representación de una funeraria.
- Cada funeraria tiene un período abierto por mes calendario.
- Al finalizar el mes, el período pasa de `ABIERTO` a `PENDIENTE_CONFIRMACION` y se crea el período siguiente.
- Los importes aplicados se guardan en cada fallecido para preservar valores históricos.
- Un período sólo puede aprobarse si todos sus comprobantes individuales y el comprobante mensual están aprobados.

## Entidades mínimas

### Funeraria

```json
{
  "id": "funeraria-id",
  "nombre": "Casa funeraria",
  "cuit": "CUIT",
  "usuarios": ["usuario-id"],
  "responsableCierreUsuarioId": null,
  "activa": true
}
```

### Fallecido

```json
{
  "funerariaId": "funeraria-id",
  "periodoId": "periodo-id",
  "obito": {},
  "tipoSepultura": "economico",
  "precioAplicado": 1000,
  "condicionPago": "PAGO",
  "estadoRevisionPago": "PENDIENTE",
  "documentos": {}
}
```

`condicionPago` admite `PAGO` y `EXENTO`. Ambos requieren comprobante. Los exentos no suman al total mensual.

### Período

```json
{
  "id": "periodo-id",
  "funeraria": {},
  "fechaInicio": "2026-06-01",
  "fechaFin": "2026-06-30",
  "anio": 2026,
  "mes": 6,
  "estado": "ABIERTO",
  "fallecidos": [],
  "total": 0,
  "comprobantePagoMensual": null,
  "estadoRevisionPagoMensual": "PENDIENTE"
}
```

Estados de período: `ABIERTO`, `PENDIENTE_CONFIRMACION`, `EN_PROCESO`, `APROBADO`, `RECHAZADO`.

## Endpoints requeridos

```text
GET  /cementerio/funerarias
POST /cementerio/funerarias
PUT  /cementerio/funerarias/:id
PUT  /cementerio/funerarias/:id/usuarios/:userId
GET  /cementerio/periodos
GET  /cementerio/periodos/mis-periodos
GET  /cementerio/periodos/:id
POST /cementerio/periodos/:id/confirmar
PUT  /cementerio/periodos/:periodoId/fallecidos/:fallecidoId/revision
PUT  /cementerio/periodos/:periodoId/revision-pago-mensual
PUT  /cementerio/periodos/:id/resolver
```

Los endpoints existentes de certificados de defunción continúan utilizándose para crear y editar fallecidos.
Todas las rutas internas requieren JWT. Los permisos y la pertenencia a una funeraria se validan nuevamente en backend.

## Configuración inicial

La configuración temporal del frontend se encuentra en `config/cementerio.js`:

- Día de cierre: `DIA_CIERRE_PERIODO`.
- Tipos y precios de sepultura: `TIPOS_SEPULTURA`.

El cierre automático y la validación de permisos deben implementarse obligatoriamente en backend.
