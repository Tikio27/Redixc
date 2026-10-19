// Task groups for verify.mjs. Each group checks the proposal unless noted.
const P = (path) => `${path}?tema=light`;
const ADDRESS =
  "Rafael Mejía Amaral #55, El Botadero, Santiago Ixcuintla, Nayarit, C.P. 63575";
const VISOR = "https://tarifas.ift.org.mx/ift_visor/";

export function registerChecks({ group, check, open, assert, ROUTES, BASE, DESKTOP, MOBILE }) {
  group("datos", async (browser) => {
    await check("datos: IFT number on every plan card", async () => {
      const { page, context } = await open(browser, P("/planes"));
      const texts = await page.locator(".all-plans .plan").allTextContents();
      await context.close();
      assert(texts.length === 6, `expected 6 cards, got ${texts.length}`);
      texts.forEach((t, i) =>
        assert(
          t.includes(`Número de inscripción IFT: ${2233240 + i}`),
          `card ${i} lacks its IFT number`,
        ),
      );
    });
    for (const route of ["/planes", "/legal"])
      await check(`datos: IFT tariff viewer linked on ${route}`, async () => {
        const { page, context } = await open(browser, P(route));
        const n = await page.locator(`a[href="${VISOR}"]`).count();
        await context.close();
        assert(n >= 1, "no link to the tariff viewer");
      });
    for (const route of ROUTES)
      await check(`datos: address in footer ${route}`, async () => {
        const { page, context } = await open(browser, P(route));
        const footer = await page.locator("footer").textContent();
        await context.close();
        assert(footer.includes(ADDRESS), "footer lacks the published address");
      });
  });

  group("recomendador", async (browser) => {
    for (const [label, viewport] of [["1440", DESKTOP], ["390", MOBILE]])
      await check(`recomendador: Inicio lleva al plan sugerido @${label}`, async () => {
        const { page, context } = await open(browser, P("/"), viewport);
        const reco = page.locator(".hero-after");
        await reco.locator(".activity", { hasText: "Trabajar" }).click();
        await reco.locator(".recommender-action .button").click();
        await page.waitForTimeout(600);
        const text = await reco.locator(".recommend-result p").textContent();
        await reco.locator(".recommend-result .button").click();
        await page.waitForTimeout(1200);
        const state = await page.evaluate(() => {
          const card = document.querySelector(".plan.recommended");
          if (!card) return null;
          const r = card.getBoundingClientRect();
          return {
            path: location.pathname,
            top: r.top,
            bottom: r.bottom,
            header: document.querySelector(".header").getBoundingClientRect().bottom,
            focusInside: card.contains(document.activeElement),
          };
        });
        await context.close();
        assert(text.includes("para trabajar"), `result text: ${text}`);
        assert(!text.includes("según uso de"), `result text: ${text}`);
        assert(state, "no recommended card on /planes");
        assert(state.path.endsWith("/planes"), `landed on ${state.path}`);
        assert(state.top >= state.header, `card top ${state.top} under header ${state.header}`);
        assert(state.bottom <= viewport.height, `card bottom ${state.bottom} below viewport`);
        assert(state.focusInside, "focus is not inside the recommended card");
      });
  });

  group("planes", async (browser) => {
    for (const [label, viewport] of [["1440", DESKTOP], ["390", MOBILE]]) {
      await check(`planes: catálogo antes del recomendador plegado @${label}`, async () => {
        const { page, context } = await open(browser, P("/planes"), viewport);
        const s = await page.evaluate(() => {
          const plan = document.querySelector(".plan");
          const reco = document.querySelector("#recomendador");
          const details = reco?.closest("details.recommender-disclosure");
          return {
            planFirst: plan && reco && plan.getBoundingClientRect().top <
              (details || reco).getBoundingClientRect().top,
            inDetails: !!details,
            open: details?.open,
            summary: details?.querySelector("summary")?.textContent.trim(),
            leftovers: document.querySelectorAll(
              ".filter-tabs, .compare-tray, input[type=checkbox]",
            ).length,
          };
        });
        await context.close();
        assert(s.planFirst, "first plan card is not above the recommender");
        assert(s.inDetails && s.open === false, "recommender not in a closed disclosure");
        assert(
          s.summary === "¿No sabes cuál elegir? Te ayudamos a orientarte",
          `summary: ${s.summary}`,
        );
        assert(s.leftovers === 0, `${s.leftovers} filter/compare leftovers`);
      });
      await check(`planes: tabla de los 6 planes @${label}`, async () => {
        const { page, context } = await open(browser, P("/planes"), viewport);
        const rows = await page.locator(".plan-table tbody tr").evaluateAll((trs) =>
          trs.map((tr) => ({
            text: tr.textContent,
            ficha: tr.querySelector('a[href*="FormatoSimplificado_"]')?.getAttribute("href"),
            button: !!tr.querySelector("button"),
          })),
        );
        assert(rows.length === 6, `expected 6 rows, got ${rows.length}`);
        const expected = [["Plus", "$400", "50 Mbps", "40 Mbps", 2233242]];
        for (const [name, price, down, up, ift] of expected) {
          const row = rows.find((r) => r.text.includes(name));
          assert(row && row.text.includes(price) && row.text.includes(down) && row.text.includes(up),
            `row ${name}: ${row?.text}`);
          assert(row.ficha === `/docs/formatos/FormatoSimplificado_${ift}.pdf`, `ficha ${row.ficha}`);
        }
        assert(rows.every((r) => r.button), "a row lacks its Consultar button");
        await page.locator(".plan-table tbody tr", { hasText: "Premium" }).locator("button").click();
        await page.waitForTimeout(500);
        const title = await page.locator("#contact-title").textContent();
        await context.close();
        assert(title.includes("Premium"), `dialog title: ${title}`);
      });
    }
    await check("planes: recomendar dentro del plegable enfoca la tarjeta", async () => {
      const { page, context } = await open(browser, P("/planes"), MOBILE);
      await page.locator(".recommender-disclosure summary").click();
      await page.locator("#recomendador .activity", { hasText: "Estudiar" }).click();
      await page.locator("#recomendador .activity", { hasText: "Disfrutar" }).click();
      await page.locator("#recomendador .recommender-action .button").click();
      await page.waitForTimeout(600);
      await page.locator("#recomendador .recommend-result .button").click();
      await page.waitForTimeout(800);
      const ok = await page.evaluate(() =>
        document.querySelector('[data-plan="Plus"]').contains(document.activeElement),
      );
      await context.close();
      assert(ok, "focus did not move to the Plus card");
    });
    await check("planes: sin scroll horizontal a 320 px", async () => {
      const { page, context } = await open(browser, P("/planes"), { width: 320, height: 700, isMobile: true, hasTouch: true });
      const s = await page.evaluate(() => {
        const region = document.querySelector(".plan-table")?.closest(".table-scroll");
        return {
          page: document.documentElement.scrollWidth - 320,
          scrolls: region ? region.scrollWidth > region.clientWidth : null,
        };
      });
      await context.close();
      assert(s.page === 0, `page overflow ${s.page}px`);
      assert(s.scrolls !== null, "table is not inside .table-scroll");
    });
  });

  group("cobertura-modulos", async (browser) => {
    for (const [label, viewport] of [["1440", DESKTOP], ["390", MOBILE]])
      await check(`cobertura-modulos: contenido de la página @${label}`, async () => {
        const { page, context } = await open(browser, P("/cobertura"), viewport);
        const s = await page.evaluate(() => {
          const main = document.querySelector("main");
          const office = document.querySelector(".coverage-office");
          return {
            disclaimers: (main.innerText.match(/no confirma (la )?cobertura/gi) || []).length,
            steps: [...document.querySelectorAll(".coverage-steps > li h3")].map((h) => h.textContent.trim()),
            officeText: office?.innerText || "",
            maps: office?.querySelector("a[href*='maps']")?.href || "",
            tel: !!office?.querySelector('a[href="tel:+523111447676"]'),
            caption: office?.querySelector("figcaption")?.textContent || "",
            muralAlt: office?.querySelector("img")?.alt || "",
            community: document.querySelector(".coverage-community") !== null,
            plans: [...document.querySelectorAll(".coverage-plans .plan")].map((c) => c.dataset.plan),
            allPlans: !!document.querySelector('.coverage-plans a[href="/planes"]'),
          };
        });
        await context.close();
        assert(s.disclaimers === 1, `${s.disclaimers} coverage disclaimers`);
        assert(JSON.stringify(s.steps) === JSON.stringify(
          ["Elige tu localidad", "Envíanos una referencia", "Te confirmamos"]), `steps ${s.steps}`);
        assert(s.officeText.includes("Rafael Mejía Amaral #55, El Botadero"), "office lacks address");
        assert(s.maps === "https://maps.app.goo.gl/N9wUGfgTxWjugjJT7", `maps: ${s.maps}`);
        assert(s.tel, "office lacks phone link");
        assert(/Águilas del Botadero/.test(s.caption) && /deportivo/.test(s.caption), `caption: ${s.caption}`);
        assert(/mural|muro/i.test(s.muralAlt), `alt: ${s.muralAlt}`);
        assert(!s.community, "community strip should live on Inicio, not Cobertura");
        assert(JSON.stringify(s.plans) === JSON.stringify(["Básico", "Plus", "Ultra"]), `plans ${s.plans}`);
        assert(s.allPlans, "no link to all plans");
      });
    await check("cobertura-modulos: la referencia del domicilio va en el mensaje", async () => {
      const { page, context } = await open(browser, P("/cobertura"));
      await page.locator(".coverage-panel button", { hasText: "Villa Juárez" }).click();
      await page.waitForTimeout(500);
      const field = page.locator("#contact-address");
      const label = await page.locator('label[for="contact-address"]').textContent();
      await field.fill("Calle Morelos 5, frente a la tienda");
      const s = await page.evaluate(() => ({
        message: document.querySelector(".message-preview p").textContent,
        hint: document.querySelector(".contact-modal").innerText.includes("compartir tu ubicación"),
        href: decodeURIComponent(document.querySelector(".modal-actions a").href),
      }));
      await context.close();
      assert(/Calle, número o referencia/.test(label) && /opcional/.test(label), `label: ${label}`);
      assert(s.message.includes("Mi domicilio o referencia: Calle Morelos 5, frente a la tienda."), `message: ${s.message}`);
      assert(s.href.includes("Calle Morelos 5"), "WhatsApp link lacks the reference");
      assert(s.hint, "no hint about sharing location");
    });
  });

  group("inicio-beneficios", async (browser) => {
    for (const [label, viewport] of [["1440", DESKTOP], ["390", MOBILE]])
      await check(`inicio-beneficios: tres beneficios con la historia @${label}`, async () => {
        const { page, context } = await open(browser, P("/"), viewport);
        const s = await page.evaluate(() => {
          const items = [...document.querySelectorAll(".home-benefits .home-benefit")];
          return {
            titles: items.map((i) => i.querySelector("h2")?.textContent.trim()),
            first: items[0]?.innerText || "",
            link: items[2]?.querySelector('a[href="/nosotros"]')?.textContent.trim(),
            third: items[2]?.innerText || "",
          };
        });
        await context.close();
        assert(JSON.stringify(s.titles) === JSON.stringify(
          ["Mes a mes, sin sorpresas", "Técnicos locales", "Parte de tu comunidad"]), `titles ${s.titles}`);
        assert(/plazos forzosos/.test(s.first) && /precios fijos/i.test(s.first), `first: ${s.first}`);
        assert(/escuelas/.test(s.third) && /comisariado ejidal/.test(s.third), `third: ${s.third}`);
        assert(s.link === "Conoce nuestra historia", `link: ${s.link}`);
      });
    for (const [label, viewport] of [["1440", DESKTOP], ["1024", { width: 1024, height: 800 }]])
      await check(`inicio-beneficios: títulos e iconos alineados @${label}`, async () => {
        const { page, context } = await open(browser, P("/"), viewport);
        const s = await page.evaluate(() =>
          [...document.querySelectorAll(".home-benefits .home-benefit")].map((i) => ({
            title: i.querySelector("h2").getBoundingClientRect().top,
            icon: i.querySelector("svg").getBoundingClientRect().top,
            width: i.getBoundingClientRect().width,
          })),
        );
        await context.close();
        const spread = (k) => Math.max(...s.map((x) => x[k])) - Math.min(...s.map((x) => x[k]));
        assert(spread("title") <= 1, `title tops differ by ${spread("title")}px`);
        assert(spread("icon") <= 1, `icon tops differ by ${spread("icon")}px`);
        assert(spread("width") <= 30, `column widths differ by ${spread("width")}px`);
      });
  });

  group("cobertura", async (browser) => {
    await check("cobertura: una acción por localidad", async () => {
      const { page, context } = await open(browser, P("/cobertura"), MOBILE);
      const s = await page.evaluate(() => {
        const panel = document.querySelector(".coverage-panel");
        return {
          buttons: [...panel.querySelectorAll("button")].map((b) => ({
            text: b.textContent.trim(),
            h: b.getBoundingClientRect().height,
          })),
          selects: document.querySelectorAll("main select").length,
          prepare: [...document.querySelectorAll("main button")].filter((b) =>
            b.textContent.includes("Preparar consulta"),
          ).length,
        };
      });
      await page.locator(".coverage-panel button", { hasText: "Pueblo Nuevo" }).click();
      await page.waitForTimeout(500);
      const locality = await page.locator('.contact-modal input[name="contact-locality"]:checked').inputValue();
      await context.close();
      assert(
        JSON.stringify(s.buttons.map((b) => b.text)) ===
          JSON.stringify(["El Botadero", "Pueblo Nuevo", "Villa Juárez", "El Carrizo"]),
        `panel buttons: ${s.buttons.map((b) => b.text)}`,
      );
      assert(s.buttons.every((b) => b.h >= 56), `heights ${s.buttons.map((b) => b.h)}`);
      assert(s.selects === 0, "a select remains on the page");
      assert(s.prepare === 0, "a duplicate «Preparar consulta» button remains");
      assert(locality === "Pueblo Nuevo", `dialog locality: ${locality}`);
    });
    await check("cabecera móvil: WhatsApp con texto y tema en el menú", async () => {
      const { page, context } = await open(browser, P("/"), MOBILE);
      const s = await page.evaluate(() => {
        const vis = (el) => !!el && el.getBoundingClientRect().width > 0 &&
          getComputedStyle(el).display !== "none";
        const wa = document.querySelector(".whatsapp-nav");
        return {
          headerTheme: vis(document.querySelector(".header-actions .theme-control")),
          waText: wa.innerText.trim(),
          waH: wa.getBoundingClientRect().height,
          brandH: document.querySelector(".brand").getBoundingClientRect().height,
        };
      });
      await page.locator(".menu-toggle").click();
      await page.waitForTimeout(500);
      const group = page.locator('#mobile-navigation [aria-label="Apariencia del sitio"]');
      const inMenu = await group.count();
      await group.locator('button[aria-label="Oscuro"]').click();
      await page.waitForTimeout(300);
      const after = await page.evaluate(() => ({
        theme: document.documentElement.dataset.theme,
        open: document.querySelector(".menu-toggle").getAttribute("aria-expanded"),
      }));
      await page.keyboard.press("Escape");
      await page.waitForTimeout(500);
      const focus = await page.evaluate(() =>
        document.activeElement.classList.contains("menu-toggle"),
      );
      await context.close();
      assert(!s.headerTheme, "theme control still visible in the mobile header");
      assert(s.waText === "WhatsApp" && s.waH >= 44, `WhatsApp "${s.waText}" ${s.waH}px`);
      assert(s.brandH >= 44, `brand link ${s.brandH}px tall`);
      assert(inMenu === 1, "theme group not inside the mobile menu");
      assert(after.theme === "dark" && after.open === "true", `after: ${JSON.stringify(after)}`);
      assert(focus, "Escape did not return focus to the menu button");
    });
  });

  group("tipografia", async (browser) => {
    for (const theme of ["light", "dark"])
      for (const [label, viewport] of [["1440", DESKTOP], ["390", MOBILE]])
        for (const route of ROUTES)
          await check(`tipografia ${route} @${label} ${theme}`, async () => {
            const { page, context } = await open(
              browser,
              `${route}?tema=${theme}`,
              viewport,
              { reducedMotion: "reduce" },
            );
            const r = await page.evaluate(auditType);
            await context.close();
            assert(!r.small.length, `text < 12px: ${r.small.slice(0, 3).join(" | ")}`);
            assert(!r.contrast.length, `low contrast: ${r.contrast.slice(0, 2).join(" | ")}`);
            assert(r.planNames.every(([size, weight]) => size >= 15 && weight >= 700),
              `plan names: ${JSON.stringify(r.planNames.slice(0, 2))}`);
            assert(r.activity.every((s) => s >= 14), `activity text: ${r.activity}`);
            assert(r.documents.every((s) => s >= 14), `document text: ${r.documents}`);
          });
    for (const [route, opener] of [
      ["/planes", ".all-plans .plan-button"],
      ["/ayuda", ".help-options .button.secondary"],
    ])
      for (const [label, viewport] of [["1440", DESKTOP], ["390", MOBILE]])
        await check(`tipografia: diálogo de ${route} @${label}`, async () => {
          const { page, context } = await open(browser, P(route), viewport, { reducedMotion: "reduce" });
          await page.locator(opener).first().click();
          await page.waitForTimeout(300);
          const small = await page.evaluate(() => {
            const out = [];
            const w = document.createTreeWalker(document.querySelector(".contact-modal"), NodeFilter.SHOW_TEXT);
            while (w.nextNode()) {
              const t = w.currentNode;
              const size = parseFloat(getComputedStyle(t.parentElement).fontSize);
              if (t.textContent.trim() && size < 12) out.push(`${size}px "${t.textContent.trim().slice(0, 25)}"`);
            }
            return out;
          });
          await context.close();
          assert(!small.length, `text < 12px: ${small.join(" | ")}`);
        });
  });

  group("detalles", async (browser) => {
    const closeTime = (page) =>
      page.evaluate(
        () =>
          new Promise((resolve) => {
            const start = performance.now();
            document.querySelector(".contact-modal").dispatchEvent(
              new KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
            );
            const tick = () =>
              document.querySelector(".contact-modal")
                ? requestAnimationFrame(tick)
                : resolve(performance.now() - start);
            tick();
          }),
      );
    const cases = [
      ["1440", DESKTOP, {}, 350],
      ["390", MOBILE, {}, 350],
      ["1440 reduced", DESKTOP, { reducedMotion: "reduce" }, 50],
    ];
    for (const [label, viewport, options, limit] of cases)
      await check(`detalles: Escape cierra en ≤ ${limit} ms @${label}`, async () => {
        const { page, context } = await open(browser, P("/planes"), viewport, options);
        await page.locator(".all-plans .plan-button").nth(2).focus();
        await page.keyboard.press("Enter");
        await page.waitForTimeout(700);
        const ms = await closeTime(page);
        await page.waitForTimeout(100);
        const back = await page.evaluate(() =>
          document.activeElement.closest("[data-plan]")?.dataset.plan,
        );
        await context.close();
        assert(ms <= limit, `closed after ${Math.round(ms)} ms`);
        assert(back === "Plus", `focus returned to ${back}`);
      });
    await check("detalles: movimiento reducido activado tras cargar", async () => {
      const { page, context } = await open(browser, P("/planes"));
      await page.locator(".all-plans .plan-button").first().click();
      await page.waitForTimeout(600);
      await page.emulateMedia({ reducedMotion: "reduce" });
      const ms = await closeTime(page);
      await context.close();
      assert(ms <= 50, `closed after ${Math.round(ms)} ms`);
    });
    await check("detalles: título SEO completo en Inicio y sin aviso de fetchPriority", async () => {
      const { page, context, errors } = await open(browser, P("/"));
      const title = await page.title();
      await page.goto(page.url().replace("/?", "/planes?"), { waitUntil: "networkidle" });
      const planesTitle = await page.title();
      await context.close();
      assert(
        title === "REDIXC - Internet de Fibra Óptica en Santiago Ixcuintla | Planes 30-150 Mbps",
        `title: ${title}`,
      );
      assert(planesTitle === "Planes · REDIXC", `planes title: ${planesTitle}`);
      assert(!errors.some((e) => /fetchPriority/.test(e)), "React fetchPriority warning");
    });
  });

  group("imagen", async (browser) => {
    const heroOf = async (path) => {
      const { page, context } = await open(browser, path);
      const r = await page.evaluate(() => {
        const img = document.querySelector(".page-intro-image, .family-visual img");
        return { src: new URL(img.currentSrc || img.src).pathname, w: img.naturalWidth, alt: img.alt };
      });
      await context.close();
      return r;
    };
    await check("imagen: Planes usa su foto propia", async () => {
      const prop = await heroOf(P("/planes"));
      assert(prop.src === "/assets/hero-planes-eleccion.webp", `planes: ${prop.src}`);
      assert(prop.w === 1200, `naturalWidth ${prop.w}`);
      assert(/señora|hijo/i.test(prop.alt), `alt: ${prop.alt}`);
    });
    await check("imagen: ningún hero repite archivo", async () => {
      const srcs = [];
      for (const route of ROUTES) srcs.push((await heroOf(P(route))).src);
      assert(new Set(srcs).size === srcs.length, `repeated: ${srcs}`);
    });
  });

  group("final", async (browser) => {
    await check("final: el sitio usa el movimiento expresivo", async () => {
      const { page, context } = await open(browser, P("/planes"));
      const classes = await page.locator(".app").getAttribute("class");
      await context.close();
      assert(/motion-expressive/.test(classes), `classes: ${classes}`);
    });
  });

  group("selectores", async (browser) => {
    for (const [label, viewport] of [["1440", DESKTOP], ["390", MOBILE]])
      await check(`selectores: localidad con botones en la consulta @${label}`, async () => {
        const { page, context } = await open(browser, P("/planes"), viewport);
        await page.locator(".all-plans .plan-button").first().click();
        await page.waitForTimeout(500);
        const modal = page.locator(".contact-modal");
        const s = await modal.evaluate((m) => ({
          selects: m.querySelectorAll("select").length,
          legend: m.querySelector("fieldset legend")?.textContent.trim(),
          options: [...m.querySelectorAll('input[name="contact-locality"]')].map((i) => i.value),
          heights: [...m.querySelectorAll(".choice")].map((c) => c.getBoundingClientRect().height),
        }));
        await modal.locator(".choice", { hasText: "Villa Juárez" }).click();
        const message = await modal.locator(".message-preview p").textContent();
        await page.keyboard.press("ArrowRight");
        const next = await modal.locator('input[name="contact-locality"]:checked').inputValue();
        await context.close();
        assert(s.selects === 0, "the dialog still has a <select>");
        assert(s.legend === "Tu localidad", `legend: ${s.legend}`);
        assert(JSON.stringify(s.options) ===
          JSON.stringify(["El Botadero", "Pueblo Nuevo", "Villa Juárez", "El Carrizo"]), `options ${s.options}`);
        assert(s.heights.every((h) => h >= 44), `heights ${s.heights}`);
        assert(message.includes("Mi localidad es Villa Juárez."), `message: ${message}`);
        assert(next === "El Carrizo", `arrow key moved to ${next}`);
      });
    await check("selectores: personas con control segmentado en el recomendador", async () => {
      const { page, context } = await open(browser, P("/"), MOBILE);
      const reco = page.locator(".hero-after");
      const s = await reco.evaluate((r) => ({
        selects: r.querySelectorAll("select").length,
        legend: r.querySelector("fieldset legend")?.textContent.trim(),
        options: [...r.querySelectorAll('input[name$="people"]')].map((i) => i.value),
        checked: r.querySelector('input[name$="people"]:checked')?.value,
        heights: [...r.querySelectorAll(".segmented-choice label")].map((c) => c.getBoundingClientRect().height),
      }));
      await reco.locator(".activity", { hasText: "Disfrutar" }).click();
      await reco.locator(".segmented-choice label", { hasText: "5+" }).click();
      await reco.locator(".recommender-action .button").click();
      await page.waitForTimeout(600);
      const result = await reco.locator(".recommend-result h3").textContent();
      await context.close();
      assert(s.selects === 0, "the recommender still has a <select>");
      assert(s.legend === "Personas conectadas a la vez", `legend: ${s.legend}`);
      assert(JSON.stringify(s.options) === JSON.stringify(["1-2", "3-4", "5+"]), `options ${s.options}`);
      assert(s.checked === "1-2", `default ${s.checked}`);
      assert(s.heights.every((h) => h >= 44), `heights ${s.heights}`);
      assert(result.includes("Ultra"), `result: ${result}`);
    });
    await check("selectores: ningún <select> en el sitio", async () => {
      let total = 0;
      for (const route of ROUTES) {
        const { page, context } = await open(browser, P(route));
        await page.evaluate(() => document.querySelectorAll("details").forEach((d) => (d.open = true)));
        total += await page.locator("select").count();
        await context.close();
      }
      assert(total === 0, `${total} <select> elements`);
    });
  });

  group("expresivo", async (browser) => {
    const E = P;
    const pseudo = (name) => () =>
      document.getAnimations().filter((a) => a.effect?.pseudoElement?.includes(name)).length;
    // Under load a view transition may start later than a fixed sample; poll.
    const waitPseudo = (page, name) =>
      page.evaluate((n) => new Promise((resolve) => {
        const t = performance.now();
        const tick = () => {
          const found = document.getAnimations().filter((a) =>
            a.effect?.pseudoElement?.includes(n)).length;
          if (found || performance.now() - t > 500) resolve(found);
          else requestAnimationFrame(tick);
        };
        tick();
      }), name);
    await check("expresivo: la tarjeta se transforma en el diálogo y vuelve", async () => {
      const { page, context } = await open(browser, E("/planes"));
      const button = page.locator(".all-plans .plan-button").nth(1);
      await button.scrollIntoViewIfNeeded();
      await button.click();
      const opening = await waitPseudo(page, "contact-morph");
      await page.waitForTimeout(600);
      const ms = await page.evaluate(() => new Promise((resolve) => {
        const t = performance.now();
        document.querySelector(".contact-modal").dispatchEvent(
          new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
        const tick = () => document.querySelector(".contact-modal")
          ? requestAnimationFrame(tick) : resolve(performance.now() - t);
        tick();
      }));
      const closing = await waitPseudo(page, "contact-morph");
      await page.waitForTimeout(500);
      const back = await page.evaluate(() => document.activeElement.closest("[data-plan]")?.dataset.plan);
      await context.close();
      assert(opening > 0, "no contact-morph animation on open");
      assert(closing > 0, "no contact-morph animation on close");
      assert(ms <= 450, `closed after ${Math.round(ms)} ms`);
      assert(back === "Esencial", `focus returned to ${back}`);
    });
    await check("expresivo: movimiento reducido con el diálogo abierto no rompe la transformación", async () => {
      const { page, context, errors } = await open(browser, E("/planes"));
      const unhandled = [];
      page.on("pageerror", (e) => unhandled.push(e.message));
      await page.locator(".all-plans .plan-button").nth(2).click();
      await page.waitForTimeout(600);
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.keyboard.press("Escape");
      await page.waitForTimeout(300);
      const leftover = await page.evaluate(() => [...document.querySelectorAll("*")]
        .filter((e) => e.style?.viewTransitionName).length);
      await page.emulateMedia({ reducedMotion: "no-preference" });
      await page.locator(".all-plans .plan-button").nth(3).click();
      const morph = await waitPseudo(page, "contact-morph");
      await page.waitForTimeout(500);
      await context.close();
      assert(leftover === 0, `${leftover} elements keep a view-transition-name`);
      assert(morph > 0, "morph no longer runs after reduced motion");
      const bad = [...errors, ...unhandled].filter((e) => /view-transition|Transition was/i.test(e));
      assert(!bad.length, `errors: ${bad[0]}`);
    });
    await check("expresivo: al plegar se anuncia «contraído» al instante y el + vuelve", async () => {
      const { page, context } = await open(browser, E("/ayuda"));
      const summary = page.locator(".faq-list summary").first();
      await summary.scrollIntoViewIfNeeded();
      await summary.click();
      await page.waitForTimeout(500);
      await summary.click();
      await page.waitForTimeout(50);
      const expanded = await summary.evaluate((e) => e.getAttribute("aria-expanded"));
      await page.waitForTimeout(200);
      const rotate = await summary.evaluate((e) => getComputedStyle(e.querySelector("svg")).rotate);
      await context.close();
      assert(expanded === "false", `aria-expanded while closing: ${expanded}`);
      assert(rotate === "none" || parseFloat(rotate) < 5, `icon rotate while closing: ${rotate}`);
    });
    await check("expresivo: el resultado viaja hasta el plan", async () => {
      const { page, context } = await open(browser, E("/"));
      const reco = page.locator(".hero-after");
      await reco.locator(".activity", { hasText: "Trabajar" }).click();
      await reco.locator(".activity", { hasText: "Estudiar" }).click();
      await reco.locator(".recommender-action .button").click();
      await page.waitForTimeout(600);
      await reco.locator(".recommend-result .button").click();
      const morph = await waitPseudo(page, "reco-morph");
      await page.waitForTimeout(800);
      const s = await page.evaluate(() => {
        const card = document.querySelector('.plan.recommended[data-plan="Plus"]');
        const r = card?.getBoundingClientRect();
        return card && { focus: card.contains(document.activeElement), top: r.top,
          header: document.querySelector(".header").getBoundingClientRect().bottom, bottom: r.bottom };
      });
      await context.close();
      assert(morph > 0, "no reco-morph animation");
      assert(s && s.focus && s.top >= s.header && s.bottom <= 900, `card: ${JSON.stringify(s)}`);
    });
    await check("expresivo: momento del hero solo en la primera visita de la sesión", async () => {
      const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
      // Count Element.animate calls on hero elements (animations are short-lived).
      await context.addInitScript(() => {
        window.__heroAnims = 0;
        const animate = Element.prototype.animate;
        Element.prototype.animate = function (...args) {
          if (this.closest?.(".hero")) window.__heroAnims++;
          return animate.apply(this, args);
        };
      });
      const page = await context.newPage();
      await page.goto(`${BASE}${E("/")}`, { waitUntil: "networkidle" });
      const heroAnims = () => window.__heroAnims;
      const first = await page.evaluate(heroAnims);
      await page.evaluate(() => (window.__heroAnims = 0));
      await page.locator(".desktop-nav a", { hasText: "Planes" }).click();
      await page.waitForTimeout(500);
      await page.locator(".header .brand").click();
      await page.waitForTimeout(100);
      const again = await page.evaluate(heroAnims);
      await context.close();
      assert(first > 0, "no hero animation on first visit");
      assert(again === 0, `${again} hero animations on return`);
    });
    await check("expresivo: el cambio de tema se funde", async () => {
      const { page, context } = await open(browser, E("/"));
      await page.locator('.header-actions button[aria-label="Oscuro"]').click();
      const fades = await waitPseudo(page, "root");
      await page.waitForTimeout(400);
      const theme = await page.evaluate(() => document.documentElement.dataset.theme);
      await context.close();
      assert(fades > 0, "no root view transition");
      assert(theme === "dark", `theme ${theme}`);
    });
    await check("expresivo: los plegables se abren y cierran con altura animada", async () => {
      const { page, context } = await open(browser, E("/ayuda"));
      const summary = page.locator(".faq-list summary").first();
      await summary.scrollIntoViewIfNeeded();
      const state = () => page.evaluate(() => {
        const d = document.querySelector(".faq-list details");
        return { open: d.open, anims: d.getAnimations().length };
      });
      await summary.click();
      await page.waitForTimeout(40);
      const opening = await state();
      await page.waitForTimeout(500);
      const opened = await state();
      await summary.click();
      await page.waitForTimeout(500);
      const closed = await state();
      await summary.click();
      await page.waitForTimeout(60);
      await summary.click();
      await page.waitForTimeout(600);
      const interrupted = await state();
      await context.close();
      assert(opening.anims > 0, "no height animation while opening");
      assert(opened.open === true, "did not open");
      assert(closed.open === false, "did not close");
      assert(interrupted.open === false, "double click did not end closed");
    });
    for (const [label, viewport] of [["1440", DESKTOP], ["390", MOBILE]]) {
      await check(`expresivo: primera pantalla visible @${label}`, async () => {
        const { page, context } = await open(browser, E("/planes"), viewport);
        await page.waitForTimeout(900);
        const hidden = await page.evaluate(() => [...document.querySelectorAll("main *")]
          .filter((e) => { const r = e.getBoundingClientRect();
            return r.width && r.height && r.top >= 0 && r.bottom <= innerHeight && !e.closest("[hidden]") &&
              !e.matches(":is(.choice, .segmented-choice > label) > input"); })
          .filter((e) => parseFloat(getComputedStyle(e).opacity) < 1).length);
        await context.close();
        assert(hidden === 0, `${hidden} translucent elements in first viewport`);
      });
      await check(`expresivo: salto directo deja el contenido visible @${label}`, async () => {
        const { page, context } = await open(browser, E("/"), viewport);
        const opacity = await page.evaluate(async () => {
          const el = [...document.querySelectorAll(".connection-step-grid > li")].at(-1);
          el.scrollIntoView({ block: "center", behavior: "instant" });
          await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
          return parseFloat(getComputedStyle(el).opacity);
        });
        await context.close();
        assert(opacity >= 0.99, `opacity ${opacity}`);
      });
    }
    await check("expresivo: menú móvil en cascada", async () => {
      const { page, context } = await open(browser, E("/"), MOBILE);
      await page.locator(".menu-toggle").click();
      await page.waitForTimeout(40);
      const n = await page.evaluate(() => [...document.querySelectorAll("#mobile-navigation > *")]
        .filter((e) => e.getAnimations().length).length);
      await context.close();
      assert(n >= 6, `${n} animated menu items`);
    });
    await check("expresivo: respuesta al presionar una localidad", async () => {
      const { page, context } = await open(browser, E("/cobertura"));
      const button = page.locator(".coverage-panel .locality-list button").first();
      const box = await button.boundingBox();
      await page.mouse.move(box.x + 20, box.y + 20);
      await page.mouse.down();
      await page.waitForTimeout(150);
      const scale = await button.evaluate((e) => parseFloat(e.style.getPropertyValue("--fluid-scale") || "1"));
      await page.mouse.up();
      await context.close();
      assert(scale < 1, `--fluid-scale ${scale}`);
    });
    await check("expresivo: con movimiento reducido no hay transiciones ni transformaciones", async () => {
      const { page, context } = await open(browser, E("/planes"), DESKTOP, { reducedMotion: "reduce" });
      await page.locator('.header-actions button[aria-label="Oscuro"]').click();
      await page.locator(".all-plans .plan-button").first().click();
      await page.waitForTimeout(40);
      const s = await page.evaluate(() => ({
        vt: document.getAnimations().filter((a) => a.effect?.pseudoElement?.includes("view-transition")).length,
        transforms: document.getAnimations().flatMap((a) =>
          a.effect?.getKeyframes?.().filter((k) => k.transform || k.translate || k.scale) || []).length,
      }));
      await context.close();
      assert(s.vt === 0, `${s.vt} view transition animations`);
      assert(s.transforms === 0, `${s.transforms} transform keyframes`);
    });
  });

  // Foundations shared by the final motion, plus the anchored-dialog fallback
  // used where View Transitions are unavailable (simulated by removing the API).
  group("movimiento", async (browser) => {
    const M = P;
    const noVT = { noViewTransitions: true };
    await check("movimiento: sin soporte de la técnica, todo opaco", async () => {
      const { page, context } = await open(browser, M("/"));
      const low = await page.evaluate(async () => {
        const style = document.createElement("style");
        style.textContent = ".motion-purposeful *{animation:none!important}";
        document.head.append(style);
        window.scrollTo(0, document.documentElement.scrollHeight);
        await new Promise((r) => requestAnimationFrame(r));
        return [...document.querySelectorAll("main *")].filter(
          (e) => !e.closest("[hidden]") && !e.matches(":is(.choice, .segmented-choice > label) > input") && parseFloat(getComputedStyle(e).opacity) < 1,
        ).length;
      });
      await context.close();
      assert(low === 0, `${low} translucent elements`);
    });
    await check("movimiento: tarjetas informativas sin elevación al pasar el cursor", async () => {
      const { page, context } = await open(browser, M("/nosotros"));
      const card = page.locator(".values-grid article").first();
      await card.scrollIntoViewIfNeeded();
      const before = await card.evaluate((e) => [getComputedStyle(e).transform, getComputedStyle(e).boxShadow]);
      await card.hover();
      await page.waitForTimeout(400);
      const after = await card.evaluate((e) => [getComputedStyle(e).transform, getComputedStyle(e).boxShadow]);
      await context.close();
      assert(JSON.stringify(before) === JSON.stringify(after), `hover changed ${after}`);
    });
    await check("movimiento: sin View Transitions, el diálogo nace del botón (escritorio)", async () => {
      const { page, context } = await open(browser, M("/planes"), DESKTOP, noVT);
      const button = page.locator(".all-plans .plan-button").nth(2);
      await button.scrollIntoViewIfNeeded();
      const b = await button.boundingBox();
      await button.click();
      await page.waitForTimeout(60);
      const o = await page.evaluate(() => {
        const m = document.querySelector(".contact-modal");
        const r = m.getBoundingClientRect();
        const [x, y] = getComputedStyle(m).transformOrigin.split(" ").map(parseFloat);
        return { x: r.left + x, y: r.top + y };
      });
      await context.close();
      assert(o.x >= b.x && o.x <= b.x + b.width && o.y >= b.y && o.y <= b.y + b.height,
        `origin ${JSON.stringify(o)} outside button ${JSON.stringify(b)}`);
    });
    await check("movimiento: sin View Transitions, clic sin foco (Safari) también nace del botón", async () => {
      const { page, context } = await open(browser, M("/planes"), DESKTOP, noVT);
      const s = await page.evaluate(async () => {
        const btn = document.querySelectorAll(".all-plans .plan-button")[2];
        btn.scrollIntoView({ block: "center", behavior: "instant" });
        const b = btn.getBoundingClientRect();
        // Safari does not focus buttons on click: press + click, no focus.
        btn.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true }));
        btn.click();
        await new Promise((r) => setTimeout(r, 60));
        const m = document.querySelector(".contact-modal");
        const r = m.getBoundingClientRect();
        const [x, y] = getComputedStyle(m).transformOrigin.split(" ").map(parseFloat);
        return { x: r.left + x, y: r.top + y, b: { x: b.x, y: b.y, w: b.width, h: b.height } };
      });
      await context.close();
      assert(s.x >= s.b.x && s.x <= s.b.x + s.b.w && s.y >= s.b.y && s.y <= s.b.y + s.b.h,
        `origin ${s.x},${s.y} outside button ${JSON.stringify(s.b)}`);
    });
    await check("movimiento: la frase que cambia en el mensaje se resalta", async () => {
      const { page, context } = await open(browser, M("/planes"));
      await page.locator(".all-plans .plan-button").first().click();
      await page.waitForTimeout(400);
      await page.locator(".contact-modal .choice", { hasText: "Pueblo Nuevo" }).click();
      const mark = await page.locator(".message-preview mark.message-change").textContent();
      await context.close();
      assert(mark === "Pueblo Nuevo", `mark: ${mark}`);
    });
    await check("movimiento: con movimiento reducido no hay transformaciones", async () => {
      const { page, context } = await open(browser, M("/planes"), DESKTOP, { reducedMotion: "reduce" });
      await page.locator(".all-plans .plan-button").first().click();
      await page.waitForTimeout(50);
      const transforms = await page.evaluate(() =>
        document.getAnimations().flatMap((a) =>
          a.effect?.getKeyframes?.().filter((k) => k.transform || k.translate || k.scale) || []).length,
      );
      await context.close();
      assert(transforms === 0, `${transforms} transform keyframes`);
    });
  });
}

// Runs in the page. Contrast uses WCAG 2 ratios against the nearest opaque
// background; text over images or gradients is skipped (not measurable here).
function auditType() {
  const parse = (c) => {
    const m = c.match(/rgba?\(([^)]+)\)/);
    if (!m) return null;
    const p = m[1].split(/[ ,/]+/).filter(Boolean).map(Number);
    return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 };
  };
  const lum = ({ r, g, b }) => {
    const f = (v) => ((v /= 255) <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
  };
  const ratio = (a, b) => {
    const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
    return (x + 0.05) / (y + 0.05);
  };
  const bgOf = (el) => {
    for (let n = el; n && n !== document.documentElement; n = n.parentElement) {
      const s = getComputedStyle(n);
      if (s.backgroundImage !== "none") return null;
      const c = parse(s.backgroundColor);
      if (c && c.a > 0.9) return c;
    }
    return parse(getComputedStyle(document.body).backgroundColor);
  };
  const visible = (el) => {
    const r = el.getBoundingClientRect();
    const s = getComputedStyle(el);
    return r.width > 0 && r.height > 0 && s.visibility !== "hidden" &&
      !el.closest("[hidden], .sr-only, [inert], details:not([open]) > :not(summary)");
  };
  const small = new Set(), contrast = new Set();
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    const t = walker.currentNode;
    const el = t.parentElement;
    if (!t.textContent.trim() || !visible(el)) continue;
    const s = getComputedStyle(el);
    const size = parseFloat(s.fontSize);
    const text = t.textContent.trim().slice(0, 30);
    if (size < 12) small.add(`${size}px "${text}"`);
    const fg = parse(s.color), bg = bgOf(el);
    if (!fg || !bg || fg.a < 0.9) continue;
    const large = size >= 24 || (size >= 18.66 && +s.fontWeight >= 700);
    const r = ratio(fg, bg);
    if (r < (large ? 3 : 4.5)) contrast.add(`${r.toFixed(2)} ${size}px "${text}"`);
  }
  const sizes = (sel) => [...document.querySelectorAll(sel)]
    .filter(visible).map((e) => parseFloat(getComputedStyle(e).fontSize));
  return {
    small: [...small],
    contrast: [...contrast],
    planNames: [...document.querySelectorAll(".plan-top .eyebrow")].filter(visible)
      .map((e) => [parseFloat(getComputedStyle(e).fontSize), +getComputedStyle(e).fontWeight]),
    activity: sizes(".activity small"),
    documents: sizes(".document-row p"),
  };
}
