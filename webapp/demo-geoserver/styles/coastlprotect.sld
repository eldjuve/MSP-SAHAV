<?xml version='1.0' encoding='UTF-8'?>
<StyledLayerDescriptor xmlns="http://www.opengis.net/sld" xmlns:ogc="http://www.opengis.net/ogc" version="1.0.0"><NamedLayer>
        <Name>MSPudhu:Coastal_Protection_Structures</Name>
        <UserStyle>
            <Name>coastlprotect</Name>
            <IsDefault>1</IsDefault>
            <FeatureTypeStyle>
                <Name>name</Name>
                <Rule>
                    <Name>Dyke</Name>
                    <Title>Dyke</Title>
                    <ogc:Filter>
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>Name</ogc:PropertyName>
                            <ogc:Literal>Dyke</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <PolygonSymbolizer>
                        <Fill>
                            <CssParameter name="fill">#e0b75f</CssParameter>
                        <CssParameter name="fill-opacity">0.7</CssParameter></Fill>
                        <Stroke>
                            <CssParameter name="stroke">#232323</CssParameter>
                            <CssParameter name="stroke-linejoin">bevel</CssParameter>
                        <CssParameter name="stroke-opacity">1</CssParameter></Stroke>
                    </PolygonSymbolizer>
                </Rule>
                <Rule>
                    <Name>Groin</Name>
                    <Title>Groin</Title>
                    <ogc:Filter>
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>Name</ogc:PropertyName>
                            <ogc:Literal>Groin</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <PolygonSymbolizer>
                        <Fill>
                            <CssParameter name="fill">#8ed070</CssParameter>
                        <CssParameter name="fill-opacity">0.7</CssParameter></Fill>
                        <Stroke>
                            <CssParameter name="stroke">#232323</CssParameter>
                            <CssParameter name="stroke-linejoin">bevel</CssParameter>
                        <CssParameter name="stroke-opacity">1</CssParameter></Stroke>
                    </PolygonSymbolizer>
                </Rule>
                <Rule>
                    <Name>Jetty</Name>
                    <Title>Jetty</Title>
                    <ogc:Filter>
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>Name</ogc:PropertyName>
                            <ogc:Literal>Jetty</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <PolygonSymbolizer>
                        <Fill>
                            <CssParameter name="fill">#4ad5a9</CssParameter>
                        <CssParameter name="fill-opacity">0.7</CssParameter></Fill>
                        <Stroke>
                            <CssParameter name="stroke">#232323</CssParameter>
                            <CssParameter name="stroke-linejoin">bevel</CssParameter>
                        <CssParameter name="stroke-opacity">1</CssParameter></Stroke>
                    </PolygonSymbolizer>
                </Rule>
                <Rule>
                    <Name>Pier</Name>
                    <Title>Pier</Title>
                    <ogc:Filter>
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>Name</ogc:PropertyName>
                            <ogc:Literal>Pier</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <PolygonSymbolizer>
                        <Fill>
                            <CssParameter name="fill">#3067dc</CssParameter>
                        <CssParameter name="fill-opacity">0.7</CssParameter></Fill>
                        <Stroke>
                            <CssParameter name="stroke">#232323</CssParameter>
                            <CssParameter name="stroke-linejoin">bevel</CssParameter>
                        <CssParameter name="stroke-opacity">1</CssParameter></Stroke>
                    </PolygonSymbolizer>
                </Rule>
                <Rule>
                    <Name>Sea Wall</Name>
                    <Title>Sea Wall</Title>
                    <ogc:Filter>
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>Name</ogc:PropertyName>
                            <ogc:Literal>Sea Wall</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <PolygonSymbolizer>
                        <Fill>
                            <CssParameter name="fill">#a84dd2</CssParameter>
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