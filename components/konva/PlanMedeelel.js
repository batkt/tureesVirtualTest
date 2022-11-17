import { Button } from "antd";
import React from "react";

function PlanMedeelel({ destroy, data }) {

    return (
        <div>
            <div>Код-{data.kod}</div>
            <div>Давхар-{data.davkhar}</div>
            <div>Хэмжээ-{data.talbainKhemjee}</div>
            <div className="w-full flex justify-end">
                <Button
                    style={{ backgroundColor: "#209669", color: "#ffffff" }}
                    onClick={destroy}
                >
                    Хаах
                </Button>
            </div>
        </div>
    );
}

export default PlanMedeelel;
