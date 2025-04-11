const knex = require('../config/knex');

class IcPaymentLogController {
    async getIcPaymentLog(req, res) {
        try {
            const icPaymentLog = await knex('FARMA.IC_PAYMENT_LOG')
                .where('UUID', req.params.codigoTransaccion)
                .select('*');
            res.json(icPaymentLog);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async confirmPaymentWithCard(req, res) {
        try {
            const { status, transaction_id, payment } = req.body;
            if (status === 'success') {
                try {
                    //Se verifica si existe el registro en la tabla FARMA.IC_PAYMENT_LOG
                    const existsReg = await knex('FARMA.IC_PAYMENT_LOG')
                        .where('UUID', transaction_id)
                        .andWhere('CARD_PAYMENT', 'S')
                        .andWhere('PAYMENT_WITH_CARD_CONFIRM', 'N')
                        .select('*');
                    if (existsReg.length === 1) {
                        //Si exite el registro se hace el update a la tabla FARMA.IC_PAYMENT_LOG
                        await knex('FARMA.IC_PAYMENT_LOG')
                        .where('UUID', transaction_id)
                        .update({
                            PAYMENT_WITH_CARD_CONFIRM: 'S',
                            //actualizar PAYMENT_WITH_CARD_CONFIRM_RESPONSE (columna tipo CLOB) con el objeto payment que llega en el body
                            PAYMENT_WITH_CARD_CONFIRM_RESPONSE: JSON.stringify(payment),
                            //enviar sql nativo sysdate
                            FECHA_PAYMENT_WITH_CARD_CONFIRM: knex.raw('sysdate'),
                            TICKET_NUMBER: payment.ticket_number
                        });
                        //Intentar ejecutar procedimiento que crea Operaciones de Caja, sino se ejecuta no interrumpir el flujo
                        try {
                            await knex.raw(`BEGIN FARMA.PR_IC_OPERACION_CAJA(?); END;`, [transaction_id]);
                        } catch (error) {
                            console.error("Error al ejecutar procedimiento PR_IC_OPERACION_CAJA: ", error.message);
                        }
                        res.json({
                            "status": "success",
                            "message": [
                                {
                                    "level": "success",
                                    "key": "Confirmed",
                                    "description": "Pago recibido con exito"
                                }
                            ]
                        });
                    }else{
                        res.json({
                            "status": "error",
                            "message": [
                                {
                                    "level": "success",
                                    "key": "Confirmed",
                                    "description": "No se encontro el pago con el id de transaccion o ya se confirmo previamente"
                                }
                            ]
                        });
                    }

                } catch (error) {
                    console.error(error);
                    res.json({
                        "status": "error",
                        "message": [
                            {
                                "level": "success",
                                "key": "Confirmed",
                                "description": "Error al confirmar el pago"
                            }
                        ]
                    });
                }
            } else {
                console.error("Confirmacion de Pagos que no sean success no implementados");
                res.json({
                    "status": "error",
                    "message": [
                        {
                            "level": "success",
                            "key": "Confirmed",
                            "description": "Confirmacion de Pagos que no sean success no implementados"
                        }
                    ]
                });
            }
        } catch (error) {
            console.error(error);
            res.json({
                "status": "error",
                "message": [
                    {
                        "level": "success",
                        "key": "Confirmed",
                        "description": error.message
                    }
                ]
            });
        }
    }
}

module.exports = new IcPaymentLogController();