# Gerar ícones PNG usando apenas stdlib
import struct, zlib, math

def create_png(size):
    # Criar imagem RGBA
    img = []
    cx, cy = size//2, size//2
    
    for y in range(size):
        row = []
        for x in range(size):
            # Fundo roxo escuro
            r, g, b, a = 30, 16, 64, 255
            
            # Círculo de fundo roxo
            dist = math.sqrt((x-cx)**2 + (y-cy)**2)
            if dist > size*0.48:
                a = 0  # transparente fora
            elif dist > size*0.45:
                r,g,b = 123,79,166  # borda roxa
            
            # Erlenmeyer simplificado (branco)
            # Corpo do frasco
            ex, ey = cx, cy-size*0.05
            fw = size*0.25
            fh = size*0.35
            
            # Parte superior (tubo)
            if abs(x-cx) < size*0.07 and y < cy-size*0.05:
                r,g,b = 201,168,255
            # Corpo triangular
            elif y > cy-size*0.1 and y < cy+size*0.28:
                spread = (y-(cy-size*0.1)) * 0.7
                if abs(x-cx) < size*0.07 + spread and dist < size*0.44:
                    r,g,b = 201,168,255
            
            # Gato (branco) na parte inferior
            if dist < size*0.2 and y > cy+size*0.05:
                r,g,b = 255,255,255
                # Olhos
                if abs(x-(cx-size*0.07)) < size*0.03 and abs(y-(cy+size*0.12)) < size*0.03:
                    r,g,b = 61,32,102
                if abs(x-(cx+size*0.07)) < size*0.03 and abs(y-(cy+size*0.12)) < size*0.03:
                    r,g,b = 61,32,102
            
            row.extend([r,g,b,a])
        img.append(row)
    
    # Converter para PNG
    def png_chunk(name, data):
        c = zlib.crc32(name + data) & 0xffffffff
        return struct.pack('>I', len(data)) + name + data + struct.pack('>I', c)
    
    ihdr = struct.pack('>IIBBBBB', size, size, 8, 2, 0, 0, 0)  # RGB sem alpha para simplicidade
    
    raw = b''
    for row in img:
        raw += b'\x00'  # filter byte
        for i in range(0, len(row), 4):
            raw += bytes([row[i], row[i+1], row[i+2]])  # só RGB
    
    compressed = zlib.compress(raw, 9)
    
    png = b'\x89PNG\r\n\x1a\n'
    png += png_chunk(b'IHDR', struct.pack('>IIBBBBB', size, size, 8, 2, 0, 0, 0))
    png += png_chunk(b'IDAT', compressed)
    png += png_chunk(b'IEND', b'')
    
    return png

for size in [192, 512]:
    data = create_png(size)
    with open(f'/home/claude/layerlab3/icon-{size}.png', 'wb') as f:
        f.write(data)
    print(f"icon-{size}.png criado")
