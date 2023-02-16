import { Button } from "antd";
import { t } from "i18next";
import React from "react";

function PlanMedeelel({ destroy, data }) {

    return (
        <div>
            <div>{t("Код")}-{data.kod}</div>
            <div>{t("Давхар")}-{data.davkhar}</div>
            <div>{t("Хэмжээ")}-{data.talbainKhemjee}</div>
            <div className="w-full flex justify-end">
                <Button
                    style={{ backgroundColor: "#209669", color: "#ffffff" }}
                    onClick={destroy}
                >
                    {t("Хаах")}
                </Button>
            </div>
        </div>
    );
}

export default PlanMedeelel;
