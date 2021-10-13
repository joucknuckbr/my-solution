var sells = new sells(
    [{
        codP: { type: Number, min: 10000, required: true },
        qntd_V: { type: Number},
        sit_V: { type: Number}, //100: venda confirmada e com pagamento ok. 102: venda confirmada, mas com pagamento pendente.
        //135: venda cancelada. 190: venda não finalizada no canal de vendas. 999: erro não identificado
        canal_V: { type: Number}, //1: Representante comercial. 2: Website. 3: Aplicativo móvel Android. 4: Aplicativo móvel iPhone.
    }])