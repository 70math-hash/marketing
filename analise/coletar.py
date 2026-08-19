#!/usr/bin/env python3
"""
Coleta os Insights do Instagram pela Graph API e guarda em historico.json.

O arquivo e append-only por dia: cada execucao acrescenta uma leitura nova em vez
de sobrescrever. E isso que preserva a curva de cada post ao longo do tempo, que
a API sozinha nao devolve, porque ela so entrega o total acumulado no momento.

Uso:
  python3 analise/coletar.py --probe     testa a conexao e diz quais metricas existem
  python3 analise/coletar.py             coleta e grava
  python3 analise/coletar.py --dry-run   mostra o que faria, sem gravar

Credenciais por variavel de ambiente:
  IG_TOKEN     token de acesso de longa duracao da Meta
  IG_USER_ID   id da conta Instagram Business
  IG_API       opcional, versao da Graph API (padrao v21.0)
"""
import json, os, sys, urllib.request, urllib.parse, urllib.error
from datetime import datetime, timezone
from pathlib import Path

BASE = Path(__file__).resolve().parent
HIST = BASE / "dados" / "historico.json"
API  = os.environ.get("IG_API", "v21.0")

# Metricas por tipo de midia. A disponibilidade varia por versao da API, entao o
# script pede o conjunto todo e vai tirando o que a Meta recusar, em vez de falhar.
METRICAS = {
    "FEED":     ["reach","saved","likes","comments","shares","views",
                 "total_interactions","profile_visits","follows"],
    "REELS":    ["reach","saved","likes","comments","shares","views",
                 "total_interactions","ig_reels_avg_watch_time","profile_visits","follows"],
    "CAROUSEL": ["reach","saved","likes","comments","shares","views",
                 "total_interactions","profile_visits","follows"],
}
CONTA = ["follower_count","profile_views","reach"]


def pedir(caminho, params):
    params = {**params, "access_token": os.environ["IG_TOKEN"]}
    url = f"https://graph.facebook.com/{API}/{caminho}?" + urllib.parse.urlencode(params)
    try:
        with urllib.request.urlopen(url, timeout=30) as r:
            return json.loads(r.read())
    except urllib.error.HTTPError as e:
        corpo = e.read().decode("utf-8", "replace")
        try:
            msg = json.loads(corpo)["error"]["message"]
        except Exception:
            msg = corpo[:300]
        raise RuntimeError(msg) from None


def insights_da_midia(mid, tipo):
    """Pede as metricas e, a cada recusa da Meta, remove a citada e tenta de novo."""
    restantes = list(METRICAS.get(tipo, METRICAS["FEED"]))
    recusadas = []
    while restantes:
        try:
            r = pedir(f"{mid}/insights", {"metric": ",".join(restantes)})
            return ({m["name"]: m["values"][0]["value"] for m in r.get("data", [])}, recusadas)
        except RuntimeError as e:
            texto = str(e)
            achou = [m for m in restantes if m in texto]
            if not achou:                      # erro que nao aponta metrica: desiste
                return ({}, recusadas + restantes)
            for m in achou:
                restantes.remove(m); recusadas.append(m)
    return ({}, recusadas)


def coletar():
    uid = os.environ["IG_USER_ID"]
    midias = pedir(f"{uid}/media", {
        "fields": "id,caption,media_type,media_product_type,permalink,timestamp",
        "limit": 50,
    }).get("data", [])

    agora = datetime.now(timezone.utc)
    leitura = {"lido_em": agora.isoformat(timespec="seconds"), "posts": {}, "conta": {}}
    recusadas_geral = set()

    for m in midias:
        tipo = m.get("media_product_type") or m.get("media_type") or "FEED"
        if tipo == "IMAGE": tipo = "FEED"
        dados, recusadas = insights_da_midia(m["id"], tipo)
        recusadas_geral |= set(recusadas)
        leitura["posts"][m["id"]] = {
            "publicado_em": m.get("timestamp"),
            "tipo": tipo,
            "permalink": m.get("permalink"),
            "legenda": (m.get("caption") or "")[:90],
            "metricas": dados,
        }

    try:
        r = pedir(f"{uid}/insights", {"metric": ",".join(CONTA), "period": "day"})
        leitura["conta"] = {m["name"]: m["values"][-1]["value"] for m in r.get("data", [])}
    except RuntimeError as e:
        leitura["conta"] = {"erro": str(e)[:200]}

    leitura["metricas_indisponiveis"] = sorted(recusadas_geral)
    return leitura


def gravar(leitura):
    hist = json.loads(HIST.read_text()) if HIST.exists() else {"leituras": []}
    dia = leitura["lido_em"][:10]
    # uma leitura por dia: a do dia substitui, dias anteriores ficam
    hist["leituras"] = [l for l in hist["leituras"] if l["lido_em"][:10] != dia]
    hist["leituras"].append(leitura)
    hist["leituras"].sort(key=lambda l: l["lido_em"])
    HIST.parent.mkdir(parents=True, exist_ok=True)
    HIST.write_text(json.dumps(hist, ensure_ascii=False, indent=1))
    return len(hist["leituras"])


def main():
    args = set(sys.argv[1:])
    faltando = [v for v in ("IG_TOKEN", "IG_USER_ID") if not os.environ.get(v)]
    if faltando:
        print(f"faltam as variaveis: {', '.join(faltando)}")
        print("rode a skill setup-instagram para obter token e id da conta.")
        return 1

    if "--probe" in args:
        try:
            eu = pedir(os.environ["IG_USER_ID"], {"fields":"username,followers_count,media_count"})
        except RuntimeError as e:
            print(f"conexao falhou: {e}"); return 1
        print(f"conectado: @{eu.get('username')} · {eu.get('followers_count')} seguidores "
              f"· {eu.get('media_count')} posts · API {API}")
        leitura = coletar()
        n = len(leitura["posts"])
        exemplo = next(iter(leitura["posts"].values()), {})
        print(f"posts lidos: {n}")
        print(f"metricas que vieram: {', '.join(sorted(exemplo.get('metricas', {}))) or 'nenhuma'}")
        if leitura["metricas_indisponiveis"]:
            print(f"metricas recusadas pela API: {', '.join(leitura['metricas_indisponiveis'])}")
        print(f"conta: {leitura['conta']}")
        return 0

    leitura = coletar()
    if "--dry-run" in args:
        print(json.dumps(leitura, ensure_ascii=False, indent=1)[:2000]); return 0
    n = gravar(leitura)
    ind = leitura["metricas_indisponiveis"]
    print(f"gravado. {len(leitura['posts'])} posts, {n} leituras no historico."
          + (f" indisponiveis: {', '.join(ind)}" if ind else ""))
    return 0


if __name__ == "__main__":
    sys.exit(main())
