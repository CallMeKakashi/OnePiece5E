---
map_height_y: 1347
map_width_x: 2048
scale_pixels: 268
scale_pixels_range: 25
mapCalc1: 0
publish: true
---

### The Law: "The Decibel Decree"

Here is the social structure:

- The Emperor (The Crescendo): Allowed to use Microphones, Amplifiers, and Shout. His voice booms across the island 24/7 via loudspeakers.
    
- The High Nobles (The Fortes): Allowed to Shout and Laugh. They are obnoxiously loud, screaming their orders.
    
- The Guards/Knights (The Mezzos): Allowed to speak at Normal Volume to give orders.
    
- The Commoners (The Mutes): Strictly forbidden from making vocal sounds.
	- Communication: They use sign language or chalkboards.
	- The Penalty: If a commoner speaks above a whisper, the "Mezzos" execute them on the spot.
	- Clothing: Commoners wear iron jaw-locks or heavy scarves to muffle accidental coughs/sneezes.

### The Four Noble Houses

The Nobles (The Fortissimo) are divided into four houses. Three are loyal and powerful; one is the "House of Shame."

#### 1. House Anthem (The Loyalists)

- Theme: High Pitch / Opera / Soprano.
    
- Role: The Emperor’s Heralds and Propagandists.
    
- Personality: They don't just speak; they project. They dress in finery with massive collars that act as megaphones. They believe their blood is "purest" because their voices carry the furthest.
    
- Combat Style: Sonic Screams, glass-shattering high notes.

#### 2. House Tremor (The Enforcers)

- Theme: Bass / Low Frequency / Sub-woofer.
    
- Role: The Military Commanders and Heavy Labor Overseers.
    
- Personality: Massive, physically imposing people. They speak in chest-rattling deep voices. They believe in the "Weight of Sound." They look down on high-pitched noises as weak.
    
- Combat Style: Impact Dials, ground-shaking stomps, heavy weaponry.

#### 3. House Echo (The Spies)

- Theme: Reverb / Mimicry / Delay.
    
- Role: Intelligence and Secret Police.
    
- Personality: They never speak their own thoughts; they only repeat the Emperor’s will or repeat what they heard others say to incriminate them. They are creepy, often finishing each other's sentences or speaking in unison.
    
- Combat Style: Confusion, misdirection, throwing their voices to distract enemies.

#### 4. House Sin (The Fallen / The Discord)

- Theme: Noise / Static / Distortion.
    
- Lore: Centuries ago, they were the Royal Family's rivals who led a failed rebellion. Instead of execution, the Emperor cursed them to be "The Noise of the Kingdom."
    
- The Curse:
	- They are allowed to speak, but they are socially reviled.
	    
	- The Naming Rite: Their family names were stripped. Every member of House Sin is named after a "bad sound" or a sin (e.g., Retch, Screech, Glutton, Hiss).
	    
	- The Job: They are forced to be the Town Criers for bad news (announcing executions, plague, or taxes). They are hated by the Nobles for being traitors, and hated by the Commoners (Mutes) because they have the privilege of speech but use it to serve the Empire.

- Current Status: They live in the slums (The Mute District) but are the only ones there making noise. They are chaotic, punk-rock aesthetic, and desperate.

> [!NOTE]- Quick Calculator  
> Map Height in Pixels: `INPUT[number:1347]`  
> Map Width in Pixels: `INPUT[number:2048]`  
> lat: `VIEW[{map_height_y} / 2][math]`  
> long: `VIEW[{map_width_x} / 2][math]`  
> How Many Pixels In Scale: `INPUT[number:scale_pixels]`  
> How Many Units in Scale: `INPUT[number:scale_pixels_range]`  
> Scale: `VIEW[1/({scale_pixels}/{scale_pixels_range})][math:mapCalc1]`

![[decibella.svg]]

```leaflet  
id: MapCalcExample ### Must be unique with no spaces  
image: [[decibella.svg]] ### Link to the map image file. Do not add a ! in front of the image  
bounds: [[0,0], [1347, 2048]] ### Size of the map in px Height_y, Width_x. Ignore 0,0  
height: 300 ### Size of the leaflet embed in px on your screen  
width: 100% ### Size of the leaflet embed in your note  
lat: 673 ### To center the map, make this half of the map height.  
long: 1024 ### To center the map, make this half of the map width.  
minZoom: -1.5 ### Controls how far away from the map you can zoom out. Hover over the target icon to see the current level.  
maxZoom: 1 ### Controls how far towards the map you can zoom in. Hover over the target icon to see the current level.  
defaultZoom: -1 ### Sets the default zoom level when the map loads. Hover over the target icon to see the current level.  
zoomDelta: 0.5 ### Adjust how much the zoom changes when you zoom in or out.  
unit: mi ### The value displayed when measuring so you know what type of unit is being measure.  
scale: 0.09328358208955223 ### Real units/px (resolution) of your map  
recenter: false  
darkmode: false ### marker
```
