<?xml version='1.0' encoding='UTF-8'?>
<StyledLayerDescriptor xmlns="http://www.opengis.net/sld" xmlns:ogc="http://www.opengis.net/ogc" version="1.0.0"><NamedLayer>
        <Name>MSPudhu:Coastal_Amenities</Name>
        <UserStyle>
            <Name>coastlamenities</Name>
            <IsDefault>1</IsDefault>
            <FeatureTypeStyle>
                <Name>name</Name>
                <Rule>
                    <Name>Boat Parking</Name>
                    <Title>Boat Parking</Title>
                    <ogc:Filter>
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>Class</ogc:PropertyName>
                            <ogc:Literal>Boat Parking</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <PolygonSymbolizer>
                        <Fill>
                            <CssParameter name="fill">#e4bd87</CssParameter>
                        <CssParameter name="fill-opacity">0.7</CssParameter></Fill>
                        <Stroke>
                            <CssParameter name="stroke">#232323</CssParameter>
                            <CssParameter name="stroke-linejoin">bevel</CssParameter>
                        <CssParameter name="stroke-opacity">1</CssParameter></Stroke>
                    </PolygonSymbolizer>
                </Rule>
                <Rule>
                    <Name>Fishermen Work Shelter</Name>
                    <Title>Fishermen Work Shelter</Title>
                    <ogc:Filter>
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>Class</ogc:PropertyName>
                            <ogc:Literal>Fishermen Work Shelter</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <PolygonSymbolizer>
                        <Fill>
                            <CssParameter name="fill">#6952d1</CssParameter>
                        <CssParameter name="fill-opacity">0.7</CssParameter></Fill>
                        <Stroke>
                            <CssParameter name="stroke">#232323</CssParameter>
                            <CssParameter name="stroke-linejoin">bevel</CssParameter>
                        <CssParameter name="stroke-opacity">1</CssParameter></Stroke>
                    </PolygonSymbolizer>
                </Rule>
                <Rule>
                    <Name>Graveyard</Name>
                    <Title>Graveyard</Title>
                    <ogc:Filter>
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>Class</ogc:PropertyName>
                            <ogc:Literal>Graveyard</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <PolygonSymbolizer>
                        <Fill>
                            <CssParameter name="fill">#2e2424</CssParameter>
                        <CssParameter name="fill-opacity">0.7</CssParameter></Fill>
                        <Stroke>
                            <CssParameter name="stroke">#232323</CssParameter>
                            <CssParameter name="stroke-linejoin">bevel</CssParameter>
                        <CssParameter name="stroke-opacity">1</CssParameter></Stroke>
                    </PolygonSymbolizer>
                </Rule>
                <Rule>
                    <Name>Toilet</Name>
                    <Title>Toilet</Title>
                    <ogc:Filter>
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>Class</ogc:PropertyName>
                            <ogc:Literal>Toilet</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <PolygonSymbolizer>
                        <Fill>
                            <CssParameter name="fill">#eb0ce1</CssParameter>
                        <CssParameter name="fill-opacity">0.7</CssParameter></Fill>
                        <Stroke>
                            <CssParameter name="stroke">#232323</CssParameter>
                            <CssParameter name="stroke-linejoin">bevel</CssParameter>
                        <CssParameter name="stroke-opacity">1</CssParameter></Stroke>
                    </PolygonSymbolizer>
                </Rule>
            </FeatureTypeStyle>
        </UserStyle>
    </NamedLayer>
    </StyledLayerDescriptor>