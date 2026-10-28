"""Build and render a pre-rendered storefront theme in Blender.

    /Applications/Blender.app/Contents/MacOS/Blender -b -P art/storefront/build_scene.py -- \
        --theme scandi [--samples 256] [--height 1600] [--no-render]

Writes art/storefront/<theme>.blend and, unless --no-render:
  art/storefront/renders/<theme>/backplate.png   the room as seen by the app's fixed camera
                                              (export.py turns it into public/storefront/<theme>/backplate.webp)
  public/storefront/<theme>/probe.hdr        a small equirect lighting map for the chairs

The scene is built in a "stage" frame: x across, y towards the back wall
(wall face at y 0), z up from the floor. The app's world is the same, with
the top of the theme's platform at z -9.987, where the chairs' feet rest (as
in the original room). The camera matches
src/state/camera.ts and the R3F default (vertical fov 75). The chairs are not
in the render; they stay real-time, with their feet between y -1.45 and -0.91.
"""
import json
import math
import pathlib
import sys

import bmesh
import bpy
import numpy as np
from mathutils import Matrix, Vector

HERE = pathlib.Path(__file__).resolve().parent
REPO = HERE.parent.parent
ASSETS = HERE / "assets"
FONTS = REPO / "public" / "fonts"

# Where the chairs' feet rest in the app (its z), the same as the original
# room. A theme's platform top sits exactly there, so the room's floor is
# the platform's height lower and the chairs never need raising.
FEET_Z = -9.987


def camera_for(lift):
    """The app camera's eye and target in the stage frame, whose z 0 is the
    floor under a platform `lift` high."""
    floor = FEET_Z - lift
    return (0.0, -3.26023, -9.0 - floor), (0.0, 0.0, -9.5 - floor)

FOV_Y = 75.0
ASPECT = 2.4  # widest window supported; narrower windows crop the sides
CHAIR_Y = -1.124
EXPOSURE = 0.8
# The app's shadow-casting light, as a direction towards the light.
SUN_DIR = Vector((-2.36612, -8.0653, 2.40629)).normalized()


def args():
    argv = sys.argv[sys.argv.index("--") + 1 :] if "--" in sys.argv else []
    opts = {"theme": "scandi", "samples": 256, "height": 1600, "render": True, "exposure": 0.8}
    i = 0
    while i < len(argv):
        a = argv[i]
        if a == "--no-render":
            opts["render"] = False
        else:
            opts[a[2:]] = argv[i + 1]
            i += 1
        i += 1
    opts["samples"] = int(opts["samples"])
    opts["height"] = int(opts["height"])
    return opts


# ---------------------------------------------------------------- materials

def socket(sockets, identifier):
    """Mix nodes repeat socket names per data type; pick by identifier."""
    return next(sk for sk in sockets if sk.identifier == identifier)


def multiply(n, l, a, b=None, colour=None):
    """Multiply two colours (or a colour by a constant colour)."""
    mix = n.new("ShaderNodeMix")
    mix.data_type = "RGBA"
    mix.blend_type = "MULTIPLY"
    mix.inputs["Factor"].default_value = 1.0
    l.new(a, socket(mix.inputs, "A_Color"))
    if b is not None:
        l.new(b, socket(mix.inputs, "B_Color"))
    else:
        socket(mix.inputs, "B_Color").default_value = (*colour, 1)
    return socket(mix.outputs, "Result_Color")


def tex_size(asset):
    dims = json.loads((ASSETS / asset / "info.json").read_text())["dimensions_mm"]
    return dims[0] / 1000, dims[1] / 1000


def pbr(name, asset, tint=None, rough_scale=1.0, bump=0.25, rotate=0.0, scale=1.0, planks=None, saturation=1.0, offset=(0.0, 0.0)):
    """A material from a Poly Haven set, mapped in world space at its real size."""
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    nt = mat.node_tree
    n, l = nt.nodes, nt.links
    bsdf = n["Principled BSDF"]
    geo = n.new("ShaderNodeNewGeometry")
    mapping = n.new("ShaderNodeMapping")
    w, h = tex_size(asset)
    mapping.inputs["Scale"].default_value = (1 / (w * scale), 1 / (h * scale), 1 / (w * scale))
    mapping.inputs["Rotation"].default_value = (0, 0, rotate)
    mapping.inputs["Location"].default_value = (offset[0], offset[1], 0)
    l.new(geo.outputs["Position"], mapping.inputs["Vector"])

    def image(file, colour):
        node = n.new("ShaderNodeTexImage")
        node.image = bpy.data.images.load(str(ASSETS / asset / file), check_existing=True)
        node.image.colorspace_settings.name = "sRGB" if colour else "Non-Color"
        node.projection = "BOX"
        node.projection_blend = 0.25
        l.new(mapping.outputs["Vector"], node.inputs["Vector"])
        return node

    diff = image("diff.jpg", True)
    rough = image("rough.png", False)
    disp = image("disp.png", False)
    colour = diff.outputs["Color"]
    if saturation != 1.0:
        hsv = n.new("ShaderNodeHueSaturation")
        hsv.inputs["Saturation"].default_value = saturation
        l.new(colour, hsv.inputs["Color"])
        colour = hsv.outputs["Color"]
    if tint:
        colour = multiply(n, l, colour, colour=tint)
    height = disp.outputs["Color"]
    if planks:
        # Boards running towards the camera: a brick pattern gives each board
        # its own tone and a dark seam between boards.
        length, width = planks
        brick = n.new("ShaderNodeTexBrick")
        brick.offset = 0.37
        brick.offset_frequency = 1
        brick.inputs["Scale"].default_value = 1.0
        brick.inputs["Brick Width"].default_value = length
        brick.inputs["Row Height"].default_value = width
        brick.inputs["Mortar Size"].default_value = 0.004
        brick.inputs["Mortar Smooth"].default_value = 0.4
        brick.inputs["Bias"].default_value = 0.0
        brick.inputs["Color1"].default_value = (0.8, 0.76, 0.7, 1)
        brick.inputs["Color2"].default_value = (1.1, 1.06, 1.0, 1)
        brick.inputs["Mortar"].default_value = (0.22, 0.18, 0.14, 1)
        bmap = n.new("ShaderNodeMapping")
        bmap.inputs["Rotation"].default_value = (0, 0, math.pi / 2)
        l.new(geo.outputs["Position"], bmap.inputs["Vector"])
        l.new(bmap.outputs["Vector"], brick.inputs["Vector"])
        colour = multiply(n, l, colour, brick.outputs["Color"])
        seam = n.new("ShaderNodeMath")
        seam.operation = "SUBTRACT"
        l.new(disp.outputs["Color"], seam.inputs[0])
        l.new(brick.outputs["Fac"], seam.inputs[1])
        height = seam.outputs["Value"]
    l.new(colour, bsdf.inputs["Base Color"])
    rmul = n.new("ShaderNodeMath")
    rmul.operation = "MULTIPLY"
    rmul.inputs[1].default_value = rough_scale
    l.new(rough.outputs["Color"], rmul.inputs[0])
    l.new(rmul.outputs["Value"], bsdf.inputs["Roughness"])
    bmp = n.new("ShaderNodeBump")
    bmp.inputs["Strength"].default_value = bump
    bmp.inputs["Distance"].default_value = 0.01
    l.new(height, bmp.inputs["Height"])
    l.new(bmp.outputs["Normal"], bsdf.inputs["Normal"])
    return mat


def paint(name, colour, rough=0.6, metal=0.0):
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    b = mat.node_tree.nodes["Principled BSDF"]
    b.inputs["Base Color"].default_value = (*colour, 1)
    b.inputs["Roughness"].default_value = rough
    b.inputs["Metallic"].default_value = metal
    return mat


def paper(name, colour=(0.95, 0.9, 0.8), ribs=0.0):
    """Lamp paper: lets light through and glows warmly from a light inside."""
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    nt = mat.node_tree
    n, l = nt.nodes, nt.links
    out = n["Material Output"]
    n.remove(n["Principled BSDF"])
    diffuse = n.new("ShaderNodeBsdfDiffuse")
    diffuse.inputs["Color"].default_value = (*colour, 1)
    trans = n.new("ShaderNodeBsdfTranslucent")
    trans.inputs["Color"].default_value = (*colour, 1)
    mix = n.new("ShaderNodeMixShader")
    mix.inputs["Fac"].default_value = 0.6
    l.new(diffuse.outputs[0], mix.inputs[1])
    l.new(trans.outputs[0], mix.inputs[2])
    l.new(mix.outputs[0], out.inputs["Surface"])
    if ribs:
        # Fine horizontal ribs, darker where the paper folds.
        coords = n.new("ShaderNodeTexCoord")
        wave = n.new("ShaderNodeTexWave")
        wave.wave_type = "BANDS"
        wave.bands_direction = "Z"
        wave.inputs["Scale"].default_value = ribs
        l.new(coords.outputs["Object"], wave.inputs["Vector"])
        ramp = n.new("ShaderNodeMapRange")
        ramp.inputs["To Min"].default_value = 0.45
        ramp.inputs["To Max"].default_value = 0.75
        l.new(wave.outputs["Fac"], ramp.inputs["Value"])
        l.new(ramp.outputs["Result"], mix.inputs["Fac"])
        bump = n.new("ShaderNodeBump")
        bump.inputs["Strength"].default_value = 0.4
        l.new(wave.outputs["Fac"], bump.inputs["Height"])
        l.new(bump.outputs["Normal"], diffuse.inputs["Normal"])
    return mat


def srgb(hex_colour):
    h = hex_colour.lstrip("#")
    c = [int(h[i : i + 2], 16) / 255 for i in (0, 2, 4)]
    return tuple(x / 12.92 if x <= 0.04045 else ((x + 0.055) / 1.055) ** 2.4 for x in c)


# ---------------------------------------------------------------- geometry

def box(name, lo, hi, mat, bevel=0.0):
    """An axis-aligned box from corner lo to corner hi, optionally bevelled."""
    lo, hi = Vector(lo), Vector(hi)
    mesh = bpy.data.meshes.new(name)
    bm = bmesh.new()
    bmesh.ops.create_cube(bm, size=1.0)
    bm.to_mesh(mesh)
    bm.free()
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.collection.objects.link(obj)
    obj.location = (lo + hi) / 2
    obj.scale = hi - lo
    bpy.context.view_layer.objects.active = obj
    obj.select_set(True)
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    obj.select_set(False)
    if bevel:
        mod = obj.modifiers.new("bevel", "BEVEL")
        mod.width = bevel
        mod.segments = 3
        mod.limit_method = "NONE"
    obj.data.materials.append(mat)
    for p in obj.data.polygons:
        p.use_smooth = True
    return obj


def cylinder(name, centre, radius, depth, mat, vertices=48, rotation=(0, 0, 0)):
    bpy.ops.mesh.primitive_cylinder_add(vertices=vertices, radius=radius, depth=depth, location=centre, rotation=rotation)
    obj = bpy.context.active_object
    obj.name = name
    obj.data.materials.append(mat)
    bpy.ops.object.shade_smooth()
    return obj


def sphere(name, centre, radius, mat):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=64, ring_count=32, radius=radius, location=centre)
    obj = bpy.context.active_object
    obj.name = name
    obj.data.materials.append(mat)
    bpy.ops.object.shade_smooth()
    return obj


def lathe(name, profile, centre, mat, steps=64):
    """Spin a (radius, height) profile into a vessel."""
    mesh = bpy.data.meshes.new(name)
    bm = bmesh.new()
    verts = [bm.verts.new((r, 0, z)) for r, z in profile]
    edges = [bm.edges.new((verts[i], verts[i + 1])) for i in range(len(verts) - 1)]
    bmesh.ops.spin(bm, geom=verts + edges, cent=(0, 0, 0), axis=(0, 0, 1), angle=math.tau, steps=steps, use_merge=True)
    bmesh.ops.remove_doubles(bm, verts=bm.verts, dist=1e-5)
    bm.to_mesh(mesh)
    bm.free()
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.collection.objects.link(obj)
    obj.location = centre
    obj.data.materials.append(mat)
    for p in obj.data.polygons:
        p.use_smooth = True
    mod = obj.modifiers.new("thick", "SOLIDIFY")
    mod.thickness = 0.006
    return obj


def branch(name, start, points, radius, mat):
    curve = bpy.data.curves.new(name, "CURVE")
    curve.dimensions = "3D"
    curve.bevel_depth = radius
    curve.bevel_resolution = 3
    spline = curve.splines.new("BEZIER")
    spline.bezier_points.add(len(points) - 1)
    for bp, p in zip(spline.bezier_points, points):
        bp.co = Vector(start) + Vector(p)
        bp.handle_left_type = bp.handle_right_type = "AUTO"
    spline.bezier_points[-1].radius = 0.25
    obj = bpy.data.objects.new(name, curve)
    bpy.context.collection.objects.link(obj)
    obj.data.materials.append(mat)
    return obj


def words(name, text, centre, size, mat, font="noto-sans.ttf", spacing=1.0, depth=0.004):
    """Raised lettering on the wall, centred on centre (facing -y)."""
    curve = bpy.data.curves.new(name, "FONT")
    curve.body = text
    curve.font = bpy.data.fonts.load(str(FONTS / font), check_existing=True)
    curve.size = size
    curve.space_character = spacing
    curve.align_x = "CENTER"
    curve.align_y = "CENTER"
    curve.extrude = depth / 2
    curve.bevel_depth = depth * 0.15
    obj = bpy.data.objects.new(name, curve)
    bpy.context.collection.objects.link(obj)
    obj.location = centre
    obj.rotation_euler = (math.pi / 2, 0, 0)
    obj.data.materials.append(mat)
    return obj


def point_light(name, location, watts, kelvin=2700, radius=0.05):
    data = bpy.data.lights.new(name, "POINT")
    data.energy = watts
    data.shadow_soft_size = radius
    data.use_temperature = True
    data.temperature = kelvin
    obj = bpy.data.objects.new(name, data)
    bpy.context.collection.objects.link(obj)
    obj.location = location
    return obj


# ---------------------------------------------------------------- the room

def room(wall_mat, floor_mat, ceiling_mat, clerestory=None):
    """Back wall at y 0, side walls, ceiling, and a big street window behind the camera."""
    W, D, H, T = 7.5, 6.5, 3.6, 0.2
    box("floor", (-W, -D, -0.1), (W, 0.0, 0.0), floor_mat)
    if clerestory:
        lo, hi = clerestory
        box("wall_lower", (-W, 0, 0), (W, T, lo), wall_mat)
        box("wall_upper", (-W, 0, hi), (W, T, H), wall_mat)
    else:
        box("wall_back", (-W, 0, 0), (W, T, H), wall_mat)
    box("wall_left", (-W - T, -D, 0), (-W, T, H), wall_mat)
    box("wall_right", (W, -D, 0), (W + T, T, H), wall_mat)
    box("ceiling", (-W - T, -D, H), (W + T, T, H + T), ceiling_mat)
    # The shop front behind the camera: a wide window, so daylight from the
    # street falls across the back wall the way the app's light does.
    front = -D
    box("front_sill", (-W, front - T, 0), (W, front, 0.45), wall_mat)
    box("front_head", (-W, front - T, 3.45), (W, front, H), wall_mat)
    box("front_left", (-W, front - T, 0), (-5.5, front, H), wall_mat)
    box("front_right", (5.5, front - T, 0), (W, front, H), wall_mat)
    frame = paint("window_frame", srgb("#2a2a28"), 0.5)
    for x in (-5.5, -2.75, 0, 2.75, 5.5):
        box(f"front_mullion_{x}", (x - 0.03, front - 0.08, 0.45), (x + 0.03, front, 3.45), frame)
    box("front_transom", (-5.5, front - 0.08, 2.9), (5.5, front, 2.95), frame)


def sun_light(name, towards, strength, kelvin=5600, angle=1.0):
    """A sun shining from the direction `towards` points."""
    data = bpy.data.lights.new(name, "SUN")
    data.energy = strength
    data.angle = math.radians(angle)
    data.use_temperature = True
    data.temperature = kelvin
    obj = bpy.data.objects.new(name, data)
    bpy.context.collection.objects.link(obj)
    obj.rotation_euler = Vector(towards).normalized().to_track_quat("Z", "Y").to_euler()


def ceiling_fill(watts, kelvin=4200):
    """Soft shop lighting from the ceiling, so the room is evenly lit."""
    data = bpy.data.lights.new("ceiling_fill", "AREA")
    data.shape = "RECTANGLE"
    data.size, data.size_y = 12.0, 4.0
    data.energy = watts
    data.use_temperature = True
    data.temperature = kelvin
    obj = bpy.data.objects.new("ceiling_fill", data)
    bpy.context.collection.objects.link(obj)
    obj.location = (0, -2.2, 3.55)


def world_and_sun(sky_strength=1.0, sun_strength=3.0, sun_kelvin=5200):
    world = bpy.data.worlds.new("sky")
    bpy.context.scene.world = world
    world.use_nodes = True
    nt = world.node_tree
    env = nt.nodes.new("ShaderNodeTexEnvironment")
    env.image = bpy.data.images.load(str(ASSETS / "kloofendal_48d_partly_cloudy_puresky" / "sky.hdr"))
    nt.links.new(env.outputs["Color"], nt.nodes["Background"].inputs["Color"])
    nt.nodes["Background"].inputs["Strength"].default_value = sky_strength
    data = bpy.data.lights.new("sun", "SUN")
    data.energy = sun_strength
    data.angle = math.radians(1.5)
    data.use_temperature = True
    data.temperature = sun_kelvin
    sun = bpy.data.objects.new("sun", data)
    bpy.context.collection.objects.link(sun)
    sun.rotation_euler = SUN_DIR.to_track_quat("Z", "Y").to_euler()


# ---------------------------------------------------------------- themes

SCANDI_LIFT = 0.07
JAPANDI_LIFT = 0.06
# Scandi's sun, in the stage frame: behind the back wall and high enough to
# shine down through the clerestory onto the platform.
SCANDI_SUN = (0.9, 1.6, 6.2)


def scandi():
    wall = pbr("plaster_white", "painted_plaster_wall", tint=(1.32, 1.31, 1.28), bump=0.04, saturation=0.35, scale=1.6)
    floor = pbr("ash_boards", "ash_veneer", tint=(0.9, 0.74, 0.55), rough_scale=0.9, bump=0.25, planks=(1.6, 0.16), saturation=0.8)
    room(wall, floor, wall, clerestory=(2.5, 3.25))
    white = paint("white_trim", srgb("#f2efe8"), 0.45)
    world_and_sun(sky_strength=1.6, sun_strength=0.0)
    ceiling_fill(500, 4600)

    # Clerestory: frame, mullions and a sill along the top of the back wall.
    box("clerestory_sill", (-7.5, -0.01, 2.46), (7.5, 0.2, 2.5), white, bevel=0.006)
    box("clerestory_head", (-7.5, -0.02, 3.25), (7.5, 0.2, 3.28), white)
    for i in range(-6, 7):
        x = i * 1.2
        box(f"clerestory_mullion_{i}", (x - 0.025, 0.02, 2.5), (x + 0.025, 0.08, 3.25), white, bevel=0.004)
    # The room's main light: the sun high behind the back wall, shining down
    # through the clerestory so each pane lands on the platform as a bright
    # rectangle. The app lights the chairs from the same point
    # (ThemeScene.tsx, CLERESTORY_SUN), so their shadows fall the same way.
    sun_light("clerestory_sun", Vector(SCANDI_SUN) - Vector((0, CHAIR_Y, SCANDI_LIFT + 0.4)), 9.0, 5600, angle=0.5)
    box("skirting", (-7.5, -0.015, SCANDI_LIFT), (7.5, 0.0, SCANDI_LIFT + 0.1), white, bevel=0.003)

    # A low birch platform under the row, running back to the wall so every
    # chair leg stands on it.
    ply = pbr("birch_ply", "plywood", tint=(0.92, 0.82, 0.68), bump=0.1, saturation=0.5)
    box("platform", (-7.5, -1.7, 0), (7.5, -0.015, SCANDI_LIFT), ply, bevel=0.008)

    # Wordmark above the frame.
    ink = paint("ink", srgb("#2f2c28"), 0.5)
    words("wordmark", "simply furnished", (0, -0.002, 2.2), 0.12, ink, spacing=1.12)
    grey = paint("ink_grey", srgb("#7a756c"), 0.5)
    words("tagline", "S H O W R O O M   ·   N O R D I C   C H A I R S", (0, -0.002, 2.09), 0.032, grey)

    # A stoneware vase with dry branches beside the right-hand stop.
    stoneware = paint("stoneware", srgb("#e6e0d4"), 0.7)
    lathe("vase", [(0.0, 0.0), (0.08, 0.0), (0.1, 0.06), (0.105, 0.2), (0.08, 0.34), (0.045, 0.42), (0.05, 0.45)], (2.3, -0.45, SCANDI_LIFT), stoneware)
    bark = paint("bark", srgb("#4d3d30"), 0.8)
    for i, pts in enumerate([
        [(0, 0, 0.4), (-0.05, 0, 0.7), (-0.16, 0.02, 1.0), (-0.28, 0.05, 1.18)],
        [(0, 0, 0.4), (0.02, 0, 0.75), (0.07, -0.02, 1.05), (0.1, -0.04, 1.3)],
        [(0, 0, 0.4), (0.06, 0.01, 0.65), (0.18, 0.03, 0.9), (0.33, 0.05, 1.02)],
    ]):
        branch(f"branch_{i}", (2.3, -0.45, SCANDI_LIFT), pts, 0.006, bark)


def japandi():
    wall = pbr("clay_plaster", "clay_plaster", tint=(1.3, 1.25, 1.18), bump=0.18, scale=1.4, saturation=0.45)
    floor = pbr("tatami", "tatami_mat", rough_scale=1.0, bump=0.2, scale=1.0, offset=(0.45, 0.0))
    ceiling = paint("ceiling", srgb("#e9e1d4"), 0.9)
    room(wall, floor, ceiling)
    world_and_sun(sky_strength=1.2, sun_strength=3.4, sun_kelvin=5000)
    ceiling_fill(500, 4000)
    oak = pbr("oak", "oak_veneer_01", tint=(0.95, 0.92, 0.88), bump=0.08, saturation=0.55)
    walnut = pbr("walnut", "walnut_veneer", tint=(0.32, 0.28, 0.25), bump=0.06, saturation=0.8)
    box("skirting", (-7.5, -0.015, JAPANDI_LIFT), (7.5, 0.0, JAPANDI_LIFT + 0.08), walnut, bevel=0.003)

    # Oak slat screens framing the row at either end.
    for side in (-1, 1):
        x = 2.95
        while x < 7.4:
            cx = side * x
            box(f"slat_{cx:.2f}", (cx - 0.0225, -0.09, 0), (cx + 0.0225, -0.04, 3.6), oak, bevel=0.004)
            x += 0.09
        box(f"slat_rail_{side}", (side * 2.93 - (0 if side > 0 else 4.5), -0.04, JAPANDI_LIFT), (side * 2.93 + (4.5 if side > 0 else 0), 0.0, JAPANDI_LIFT + 0.06), walnut)

    # Noren: four linen panels on a rod, the shop's sign.
    linen = pbr("indigo_linen", "rough_linen", tint=(0.05, 0.08, 0.2), bump=0.3, saturation=0.0)
    cream = paint("crest", srgb("#efe7d6"), 0.8)
    rod = paint("rod", srgb("#3b2b20"), 0.5)
    cylinder("noren_rod", (0, -0.08, 2.54), 0.016, 2.1, rod, rotation=(0, math.pi / 2, 0))
    for x in (-0.75, -0.25, 0.25, 0.75):
        bpy.ops.mesh.primitive_grid_add(x_subdivisions=24, y_subdivisions=12, size=1, location=(x, -0.06, 2.27), rotation=(math.pi / 2, 0, 0))
        panel = bpy.context.active_object
        panel.name = f"noren_{x}"
        panel.scale = (0.47, 0.52, 1)
        bpy.ops.object.transform_apply(scale=True)
        for v in panel.data.vertices:
            depth = (2.53 - (v.co.z + 2.27)) / 0.52
            v.co.y += 0.006 * math.sin(v.co.x * 40 + x * 7) * depth
        panel.data.materials.append(linen)
        mod = panel.modifiers.new("thick", "SOLIDIFY")
        mod.thickness = 0.003
        bpy.ops.object.shade_smooth()
    cylinder("crest", (0, -0.068, 2.29), 0.14, 0.004, cream, rotation=(math.pi / 2, 0, 0))
    indigo = paint("indigo_ink", srgb("#273a5c"), 0.8)
    words("crest_mark", "SF", (0, -0.072, 2.29), 0.12, indigo, font="casanova.ttf", depth=0.002)
    words("noren_left", "S I M P L Y", (-0.75, -0.069, 2.15), 0.032, cream, depth=0.001)
    words("noren_right", "F U R N I S H E D", (0.75, -0.069, 2.15), 0.032, cream, depth=0.001)

    # A low walnut plinth under the row, running back to the wall so every
    # chair leg stands on it.
    box("plinth", (-7.5, -1.7, 0), (7.5, -0.015, JAPANDI_LIFT), walnut, bevel=0.006)

    # Andon lanterns: an oak frame round a glowing paper box.
    shade = paper("andon_paper", (0.97, 0.92, 0.82))
    for x in (-2.25, 2.25):
        cx, cy, z0 = x, -0.45, JAPANDI_LIFT
        box(f"andon_base_{x}", (cx - 0.11, cy - 0.11, z0), (cx + 0.11, cy + 0.11, z0 + 0.025), walnut, bevel=0.004)
        box(f"andon_paper_{x}", (cx - 0.085, cy - 0.085, z0 + 0.04), (cx + 0.085, cy + 0.085, z0 + 0.52), shade)
        for dx in (-1, 1):
            for dy in (-1, 1):
                px, py = cx + dx * 0.09, cy + dy * 0.09
                box(f"andon_post_{x}_{dx}_{dy}", (px - 0.008, py - 0.008, z0 + 0.02), (px + 0.008, py + 0.008, z0 + 0.55), oak, bevel=0.002)
        box(f"andon_top_{x}", (cx - 0.1, cy - 0.1, z0 + 0.52), (cx + 0.1, cy + 0.1, z0 + 0.545), oak, bevel=0.003)
        # Bright enough to throw a warm pool on the plinth and wall. The app
        # adds a light here too (ThemeScene.tsx, LANTERNS) for the chairs.
        point_light(f"andon_light_{x}", (cx, cy, z0 + 0.3), 25, 2600, 0.04)


THEMES = {"scandi": (scandi, SCANDI_LIFT), "japandi": (japandi, JAPANDI_LIFT)}


# ---------------------------------------------------------------- camera and render

def look(obj, eye, target):
    obj.location = eye
    direction = Vector(target) - Vector(eye)
    obj.rotation_euler = direction.to_track_quat("-Z", "Y").to_euler()


def setup_render(samples):
    scene = bpy.context.scene
    scene.render.engine = "CYCLES"
    prefs = bpy.context.preferences.addons["cycles"].preferences
    prefs.compute_device_type = "METAL"
    prefs.get_devices()
    for d in prefs.devices:
        d.use = True
    scene.cycles.device = "GPU"
    scene.cycles.samples = samples
    scene.cycles.use_adaptive_sampling = True
    scene.cycles.use_denoising = True
    scene.cycles.denoiser = "OPENIMAGEDENOISE"
    scene.cycles.caustics_reflective = False
    scene.cycles.caustics_refractive = False
    scene.cycles.max_bounces = 8
    scene.view_settings.view_transform = "AgX"
    scene.view_settings.look = "None"
    scene.view_settings.exposure = EXPOSURE


def render_backplate(render_dir, height, lift):
    scene = bpy.context.scene
    cam_data = bpy.data.cameras.new("app_camera")
    cam_data.sensor_fit = "VERTICAL"
    cam_data.angle_y = math.radians(FOV_Y)
    cam_data.clip_start = 0.1
    cam = bpy.data.objects.new("app_camera", cam_data)
    scene.collection.objects.link(cam)
    look(cam, *camera_for(lift))
    scene.camera = cam
    scene.render.resolution_x = round(height * ASPECT)
    scene.render.resolution_y = height
    scene.render.resolution_percentage = 100
    scene.render.image_settings.file_format = "PNG"
    scene.render.image_settings.color_depth = "8"
    png = render_dir / "backplate.png"
    scene.render.filepath = str(png)
    bpy.ops.render.render(write_still=True)
    return png


def render_probe(out_dir, lift, intensity=1.0, face=128, width=256):
    """Render a cube of views at the chairs and resample it into the
    equirect layout three.js expects (y is 'up' in its lookup)."""
    scene = bpy.context.scene
    view = scene.view_settings.view_transform
    scene.view_settings.view_transform = "Standard"
    samples = scene.cycles.samples
    scene.cycles.samples = 64
    cam_data = bpy.data.cameras.new("probe")
    cam_data.sensor_fit = "VERTICAL"
    cam_data.angle_y = math.radians(90)
    cam_data.clip_start = 0.02
    cam = bpy.data.objects.new("probe", cam_data)
    scene.collection.objects.link(cam)
    scene.camera = cam
    scene.render.resolution_x = scene.render.resolution_y = face
    scene.render.image_settings.file_format = "OPEN_EXR"
    scene.render.image_settings.color_depth = "32"
    centre = Vector((0, CHAIR_Y, lift + 0.45))
    faces = []
    for name, fwd, up in [
        ("px", (1, 0, 0), (0, 0, 1)), ("nx", (-1, 0, 0), (0, 0, 1)),
        ("py", (0, 1, 0), (0, 0, 1)), ("ny", (0, -1, 0), (0, 0, 1)),
        ("pz", (0, 0, 1), (0, 1, 0)), ("nz", (0, 0, -1), (0, 1, 0)),
    ]:
        f, u = Vector(fwd), Vector(up)
        r = f.cross(u)
        cam.matrix_world = Matrix.Translation(centre) @ Matrix((
            (r.x, u.x, -f.x, 0), (r.y, u.y, -f.y, 0), (r.z, u.z, -f.z, 0), (0, 0, 0, 1)))
        path = out_dir / f"probe_{name}.exr"
        scene.render.filepath = str(path)
        bpy.ops.render.render(write_still=True)
        img = bpy.data.images.load(str(path))
        px = np.array(img.pixels[:], dtype=np.float32).reshape(face, face, 4)[:, :, :3]
        faces.append((f, u, r, px))
        bpy.data.images.remove(img)
        path.unlink()
    height = width // 2
    out = np.zeros((height, width, 3), dtype=np.float32)
    for row in range(height):
        v = (row + 0.5) / height  # Blender rows run bottom-up, and so does v.
        b = (v - 0.5) * math.pi
        for col in range(width):
            a = ((col + 0.5) / width - 0.5) * math.tau
            d = Vector((math.cos(b) * math.cos(a), math.sin(b), math.cos(b) * math.sin(a)))
            f, u, r, px = max(faces, key=lambda fc: d.dot(fc[0]))
            k = d.dot(f)
            x, y = d.dot(r) / k, d.dot(u) / k
            i = min(face - 1, int((y + 1) / 2 * face))
            j = min(face - 1, int((x + 1) / 2 * face))
            out[row, col] = px[i, j] * intensity
    img = bpy.data.images.new("probe", width, height, float_buffer=True)
    rgba = np.concatenate([out, np.ones((height, width, 1), dtype=np.float32)], axis=2)
    img.pixels = rgba.ravel()
    img.filepath_raw = str(out_dir / "probe.hdr")
    img.file_format = "HDR"
    img.save()
    scene.view_settings.view_transform = view
    scene.cycles.samples = samples


def main():
    opts = args()
    theme = opts["theme"]
    global EXPOSURE
    EXPOSURE = float(opts["exposure"])
    bpy.ops.wm.read_factory_settings(use_empty=True)
    build, lift = THEMES[theme]
    build()
    setup_render(opts["samples"])
    bpy.ops.wm.save_as_mainfile(filepath=str(HERE / f"{theme}.blend"), relative_remap=True)
    if not opts["render"]:
        return
    out_dir = REPO / "public" / "storefront" / theme
    render_dir = HERE / "renders" / theme
    out_dir.mkdir(parents=True, exist_ok=True)
    render_dir.mkdir(parents=True, exist_ok=True)
    if opts.get("only") != "probe":
        render_backplate(render_dir, opts["height"], lift)
    if opts.get("only") != "backplate":
        render_probe(out_dir, lift)


main()
