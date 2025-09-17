router
  .route("/khariltsagchDavkhraarAvya")
  .post(tokenShalgakh, async (req, res, next) => {
    try {
      const { db } = require("zevbackv2");
      var davkhar = req.body.davkhar;
      var matchQuery = {
        baiguullagiinId: req.body.baiguullagiinId,
        barilgiinId: req.body.barilgiinId,
      };
      if (req.body.query) matchQuery = req.body.query;

      if (req.body.idevkhiteiEsekh == 1) {
        matchQuery.idevkhiteiEsekh = true;
      } else if (req.body.idevkhiteiEsekh == 0) {
        matchQuery.idevkhiteiEsekh = false;
      }

      var query = [
        {
          $match: matchQuery,
        },
      ];
      var result = [];
      var jagsaalt = await Khariltsagch(db.erunkhiiKholbolt).aggregate(query);

      if (jagsaalt?.length > 0) {
        var matchGeree = {
          baiguullagiinId: req.body.baiguullagiinId,
          barilgiinId: req.body.barilgiinId,
          gereeniiDugaar: { $exists: true },
          tuluv: { $nin: [-1] },
        };

        query = [
          {
            $match: matchGeree,
          },
        ];

        var gereeResult = await Geree(
          req.body.tukhainBaaziinKholbolt
        ).aggregate(query);

        if (gereeResult?.length > 0) {
          for await (const khariltsagch of jagsaalt) {
            var talbainDugaar = [];
            var shouldInclude = false;

            var filteredGeree = gereeResult?.filter(
              (geree) =>
                geree.register == khariltsagch.register ||
                geree.register == khariltsagch.customerTin ||
                geree.customerTin == khariltsagch.register
            );

            if (filteredGeree?.length) {
              for (const geree of filteredGeree) {
                khariltsagch.talbainDugaar = [];
                if (geree.talbainDugaar) {
                  if (geree.talbainDugaar.includes(",")) {
                    talbainDugaar = [
                      ...talbainDugaar,
                      ...geree.talbainDugaar.split(",").map((t) => t.trim()),
                    ];
                  } else {
                    talbainDugaar.push(geree.talbainDugaar.trim());
                  }
                  khariltsagch.talbainDugaar = [
                    ...new Set([
                      ...(khariltsagch.talbainDugaar || []),
                      ...talbainDugaar,
                    ]),
                  ];
                }

                if (davkhar?.length > 0 && geree.davkhar) {
                  const gereeDavkharStr = geree.davkhar.toString();
                  const requestDavkharArray = davkhar.map((d) => d.toString());

                  if (requestDavkharArray.includes(gereeDavkharStr)) {
                    if (
                      khariltsagch.talbainDugaar &&
                      khariltsagch.talbainDugaar.length > 0
                    ) {
                      const gereeNumbers = geree.talbainDugaar.includes(",")
                        ? geree.talbainDugaar.split(",").map((n) => n.trim())
                        : [geree.talbainDugaar.trim()];

                      const talbainMatch = gereeNumbers.some((num) =>
                        khariltsagch.talbainDugaar.some(
                          (kNum) => kNum.toString().trim() === num
                        )
                      );

                      if (talbainMatch) {
                        shouldInclude = true;
                        khariltsagch.davkhar = gereeDavkharStr;
                        break;
                      }
                    } else {
                      shouldInclude = true;
                      khariltsagch.davkhar = gereeDavkharStr;
                      break;
                    }
                  }
                }
              }
              if (davkhar?.length > 0) {
                if (shouldInclude) {
                  result.push(khariltsagch);
                }
              } else {
                result.push(khariltsagch);
              }
            } else {
              if (!davkhar?.length) {
                result.push(khariltsagch);
              }
            }
          }
        } else {
          if (!davkhar?.length) {
            result = jagsaalt;
          }
        }
      }

      res.send(result);
    } catch (error) {
      next(error);
    }
  });
