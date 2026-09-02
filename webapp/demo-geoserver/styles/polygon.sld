<?xml version='1.0' encoding='UTF-8'?>
<StyledLayerDescriptor xmlns="http://www.opengis.net/sld" version="1.0.0"><NamedLayer>
        <Name>MSPudhu:Stadium_Locations</Name>
        <UserStyle>
            <Name>polygon</Name>
            <Title>Default Polygon</Title>
            <IsDefault>1</IsDefault>
            <Abstract>A sample style that draws a polygon</Abstract>
            <FeatureTypeStyle>
                <Name>name</Name>
                <Rule>
                    <Name>rule1</Name>
                    <Title>Gray Polygon with Black Outline</Title>
                    <Abstract>A polygon with a gray fill and a 1 pixel black outline</Abstract>
                    <PolygonSymbolizer>
                        <Fill>
                            <CssParameter name="fill">#AAAAAA</CssParameter>
                        <CssParameter name="fill-opacity">0.7</CssParameter></Fill>
                        <Stroke><CssParameter name="stroke-opacity">1</CssParameter></Stroke>
                    </PolygonSymbolizer>
                </Rule>
            </FeatureTypeStyle>
        </UserStyle>
    </NamedLayer>
    </StyledLayerDescriptor>