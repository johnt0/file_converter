use wasm_bindgen::prelude::*;
use image::{ImageFormat, ImageReader};
use std::io::Cursor;

#[wasm_bindgen]
pub fn convert_image(data: Vec<u8>, file_type: String) -> Result<Vec<u8>, JsValue> {
    let img = ImageReader::new(Cursor::new(data))
        .with_guessed_format()
        .map_err(|e| JsValue::from_str(&format!("Failed to read image: {}", e)))?
        .decode()
        .map_err(|e| JsValue::from_str(&format!("Failed to decode image: {}", e)))?;

    let mut output: Vec<u8> = Vec::new();

    let output_format = match file_type.as_str() {
        "png" => ImageFormat::Png,
        "jpg" | "jpeg" => ImageFormat::Jpeg,
        "webp" => ImageFormat::WebP,
        "gif" => ImageFormat::Gif,
        _ => return Err(JsValue::from_str(&format!("Unsupported format: {}", file_type))),
    };

    img.write_to(&mut Cursor::new(&mut output), output_format)
        .map_err(|e| JsValue::from_str(&format!("Failed to write image: {}", e)))?;

    Ok(output)
}