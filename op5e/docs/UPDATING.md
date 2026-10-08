# Updating OP5e from inside the world

1. On the Foundry host run `node <Foundry Data>/modules/op5e/scripts/update-helper.mjs`. It prints a token and listens on `127.0.0.1:30111` only.
2. In the world's OP5e settings set **Update helper token** (the printed token) and **Update helper URL**.
3. Game Settings > **Update OP5e** opens the progress window.

## When the GM is not on the Foundry PC (hosting for other players)
The helper only listens on the host, so route it through your tunnel on the same site. For a Cloudflare tunnel, add this rule above the Foundry rule in `config.yml` and restart `cloudflared`:

```yaml
ingress:
  - hostname: your-site.example
    path: ^/op5e-update(/.*)?$
    service: http://localhost:30111
  - hostname: your-site.example
    service: http://localhost:30000
```

Start the helper with `OP5E_UPDATE_ORIGINS=https://your-site.example,http://localhost:30000`, and set **Update helper URL** to `https://your-site.example/op5e-update`. The token protects it: do not share it.

If an update is interrupted, press Update OP5e again: it resumes where it stopped.
